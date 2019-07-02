const TileSprite = (function() {
  const TileSprite = cc.Sprite.extend({
    ctor(type) {
      this._super();
      this.init(type);
    },

    init(type) {
      this.initWithFile(`res/${type}.png`);
      this.listener = cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: this.onSelected,
      }, this);


    },

    onSelected(touch, event) {
      const target = event.getCurrentTarget();
      const locationNode = target.convertToNodeSpace(touch.getLocation());
      const s = target.getContentSize();
      const rect = cc.rect(0, 0, s.width, s.height);

      if(cc.rectContainsPoint(rect, locationNode)) {
            const notification = NotificationCenter();
            notification.postNotification("click", target);
            return true;
          }

    }

  })
  return TileSprite;
}());
