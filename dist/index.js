function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var produce = _interopDefault(require('immer'));
var shallowUtils = require('shallow-utils');
var createSubject = _interopDefault(require('rx-subject'));

var useForceUpdate = function useForceUpdate() {
  var _useState = React.useState(true),
      io = _useState[0],
      setIO = _useState[1];

  var ioRef = React.useRef(io);
  React.useEffect(function () {
    ioRef.current = io;
  });
  var forceUpdate = React.useCallback(function () {
    return setIO(!ioRef.current);
  }, []);
  var state = React.useMemo(function () {
    return forceUpdate;
  }, [forceUpdate]);
  return state;
};

var Subject = /*#__PURE__*/function () {
  function Subject() {
    this.subject = createSubject();
  }

  var _proto = Subject.prototype;

  _proto.next = function next(value) {
    this.subject.sink.next(value);
  };

  _proto.subscribe = function subscribe(subscriber) {
    return this.subject.source$.subscribe(subscriber);
  };

  return Subject;
}();

var createContextSelector = function createContextSelector(ctx) {
  var getState = function getState() {
    return null;
  };

  var dispatcher = new Subject();
  var wrapperMounted = false;

  var useContextSelector = function useContextSelector(selector) {
    var _useState = React.useState(function () {
      if (!wrapperMounted) {
        throw new Error('the HookWrapper component should be mounted directly under the context provider');
      }

      return selector(getState());
    }),
        initialState = _useState[0];

    var selectorRef = React.useRef(selector);
    selectorRef.current = selector;
    var stateRef = React.useRef({
      value: initialState
    });
    var checkUpdate = React.useCallback(function (ctxState) {
      var newState = selectorRef.current(ctxState || getState());
      var isEqual = shallowUtils.shallowEqual({
        value: newState
      }, {
        value: stateRef.current.value
      });

      if (isEqual) {
        return false;
      }

      stateRef.current = {
        value: produce(newState, function () {})
      };
      return true;
    }, []);
    var shouldCheckEqualityInComponent = React.useRef(false);

    if (shouldCheckEqualityInComponent.current) {
      checkUpdate();
    } else {
      shouldCheckEqualityInComponent.current = true;
    }

    var forceUpdate = useForceUpdate();
    React.useEffect(function () {
      var doUpdate = function doUpdate() {
        if (!wrapperMounted) return;
        var shouldUpdate = checkUpdate();

        if (shouldUpdate) {
          shouldCheckEqualityInComponent.current = false;
          forceUpdate();
        }
      };

      var subscription = dispatcher.subscribe(doUpdate);
      doUpdate();
      return function () {
        subscription.unsubscribe();
      };
    }, []);
    return stateRef.current.value;
  };

  var Cleanner = React__default.memo(function () {
    var ctxState = React.useContext(ctx);

    getState = function getState() {
      return ctxState;
    };

    wrapperMounted = true;
    React.useEffect(function () {
      dispatcher.next(ctxState);
    });
    React.useEffect(function () {
      return function () {
        wrapperMounted = false;
      };
    }, []);
    return null;
  });
  return [Cleanner, useContextSelector];
};

exports.createContextSelector = createContextSelector;
//# sourceMappingURL=index.js.map
