const NotificationCenter = (function() {
  cc.NotificationCenter = cc.Class.extend({
  ctor: function() {
    this._observers = [];
  },

  addObserver: function(target, selector, name, obj) {
    if(this._observerExisted(target, name)) {
      return;
    }

    const observer = new cc.NotificationObserver(target, selector, name, obj);
    if(!observer) {
      return;
    }

    this._observers.push(observer);
  },

  removeObserver: function(target, name) {
    for(let i = 0; i < this._observers.length; i++) {
      const observer = this._observers[i];
      if(!observer) {
        continue;
      }
      if(observer.getName() == name && observer.getTarget() == target) {
        this._observers.splice(i, 1);
        return;
      }
    }
  },

  removeAllObservers:function(target){
          const removes = [];
          for(let i = 0; i< this._observers.length;i++){
              const selObserver = this._observers[i];
              if(selObserver.getTarget() == target)
                  removes.push(selObserver);
          }
          cc.ArrayRemoveArray(this._observers, removes);
          return removes.length;
      },

      /**
       * @param {String} name
       * @param {cc.Class} object
       */
      postNotification:function(name, object) {
          for (let i = 0; i < this._observers.length; i++) {
              const observer = this._observers[i];
              if (!observer)
                  continue;
              if (observer.getName() == name)
                  observer.performSelector(object);
          }
      },

      /**
       * @param {cc.Class} target
       * @param {String} name
       * @return {Boolean}
       * @private
       */
      _observerExisted:function(target, name) {
          for (let i = 0; i < this._observers.length; i++)
          {
              const observer = this._observers[i];
              if (!observer)
                  continue;
              if (observer.getName() == name && observer.getTarget() == target)
                  return true;
          }
          return false;
      },
  _observers:null
});

cc.NotificationCenter.getInstance = function() {
    if (!cc.s_sharedNotificationCenter) {
        cc.s_sharedNotificationCenter = new cc.NotificationCenter();
    }
    return cc.s_sharedNotificationCenter;
};

cc.NotificationObserver = cc.Class.extend({
    /**
     * @param {cc.Class} target
     * @param {String} selector
     * @param {String} name
     * @param {cc.Class} obj
     */
    ctor:function (target, selector, name, obj) {
        this._target = target;
        this._selector = selector;
        this._name = name;
        this._object = obj;
    },

    /**
     * @param {cc.Class} obj
     */
    performSelector:function (obj) {
        if (this._target && (typeof(this._selector) == "string")) {
            this._target[this._selector](obj);
        } else if (this._target && (typeof(this._selector) == "function")) {
            this._selector.call(this._target, obj);
        } else {
            this._selector(obj);
        }
    },

    _target:null,
    _selector:null,
    _name:null,
    _object:null,

    /**
     * @return {cc.Class}
     */
    getTarget:function () {
        return this._target;
    },

    /**
     * @return {String}
     */
    getSelector:function () {
        return this._selector;
    },

    /**
     * @return {String}
     */
    getName:function () {
        return this._name;
    },

    /**
     * @return {cc.Class}
     */
    getObject:function () {
        return this._object;
    }
});

return cc.NotificationCenter.getInstance();
})
