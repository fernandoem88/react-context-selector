import React, { useState, useRef, useEffect, useCallback, useMemo, useContext } from 'react';
import produce from 'immer';
import { shallowEqual } from 'shallow-utils';
import createSubject from 'rx-subject';

var useForceUpdate = function useForceUpdate() {
  var _useState = useState(true),
      io = _useState[0],
      setIO = _useState[1];

  var ioRef = useRef(io);
  useEffect(function () {
    ioRef.current = io;
  });
  var forceUpdate = useCallback(function () {
    return setIO(!ioRef.current);
  }, []);
  var state = useMemo(function () {
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
    var _useState = useState(function () {
      if (!wrapperMounted) {
        throw new Error('the HookWrapper component should be mounted directly under the context provider');
      }

      return selector(getState());
    }),
        initialState = _useState[0];

    var selectorRef = useRef(selector);
    selectorRef.current = selector;
    var stateRef = useRef({
      value: initialState
    });
    var checkUpdate = useCallback(function (ctxState) {
      var newState = selectorRef.current(ctxState || getState());
      var isEqual = shallowEqual({
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
    var shouldCheckEqualityInComponent = useRef(false);

    if (shouldCheckEqualityInComponent.current) {
      checkUpdate();
    } else {
      shouldCheckEqualityInComponent.current = true;
    }

    var forceUpdate = useForceUpdate();
    useEffect(function () {
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

  var Cleanner = React.memo(function () {
    var ctxState = useContext(ctx);

    getState = function getState() {
      return ctxState;
    };

    wrapperMounted = true;
    useEffect(function () {
      dispatcher.next(ctxState);
    });
    useEffect(function () {
      return function () {
        wrapperMounted = false;
      };
    }, []);
    return null;
  });
  return [Cleanner, useContextSelector];
};

export { createContextSelector };
//# sourceMappingURL=index.modern.js.map
