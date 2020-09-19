
const _defaultCallback = (isAtBottom: boolean) => {
  console.log('No watcher callback set. isAtBottom:: ', isAtBottom);
};

const SMW = {

  _watching: false,
  _ticking: false,
  _scrollParent: document.body,
  _isAtBottom: true,
  _callback: _defaultCallback,

  /**
   * When a user scrolls to the bottom, it indicates that they want
   * to watch for new lines. Any other scroll position indicates
   * that the user wants to read logs and not watch for the latest
   * incoming lines. callback is called any time the user reaches/leaves
   * the bottom of the scroll container.
   */
  watch: (scrollParent: HTMLElement, callback: (isAtBottom: boolean) => void) => {

    // prevent multiple subscriptions to scroll event
    if (SMW._watching) return;

    SMW._scrollParent = scrollParent;
    SMW._callback = callback;

    SMW._ticking = false;

    scrollParent.addEventListener('scroll', SMW._scrollHandler);

    SMW._watching = true;
  },

  /** Reset state and remove scroll listener */
  stop: () => {

    SMW._scrollParent.removeEventListener(
      'scroll',
      SMW._scrollHandler
    );
    SMW._watching = false;
    SMW._ticking = false;
    SMW._callback = _defaultCallback;
  },

  /** From MDN: use _ticking flag to ensure extra callbacks are not
   * queued
   */
  _scrollHandler: () => {

    if (!SMW._ticking) {
      SMW._ticking = true;

      window.requestAnimationFrame(function() {
        // put this first, so that if the following code throws an error
        // this ticking state does not get ruined
        SMW._ticking = false;

        SMW._dispatchWatchState(
          SMW._scrollParent,
          SMW._callback
        );
      });
    }
  },

  /** Given the current scrollParent, determine if user is scrolled to bottom,
   * and if the state has changed, notify subscriber
   */
  _dispatchWatchState: (scrollParent: HTMLElement, callback: (watchState: boolean) => void) => {
    const total_height = scrollParent.scrollHeight;
    const distance_from_top = scrollParent.scrollTop;
    const visible_height = scrollParent.clientHeight;

    // give this a  buffer area to "snap" to bottom
    const buffer_area = 20;

    const is_at_bottom = (
      total_height - distance_from_top
    ) <= (visible_height + buffer_area);

    // If the state has changed, notify subscriber
    if (SMW._isAtBottom !== is_at_bottom) {
      SMW._isAtBottom = is_at_bottom;
      callback(SMW._isAtBottom);
    }
  }
}

export default SMW;
