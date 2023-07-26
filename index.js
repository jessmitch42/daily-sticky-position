let callFrame = null;

document.addEventListener("DOMContentLoaded", () => {
  const joinForm = document.getElementById("joinForm");
  const callContainer = document.getElementById("dailyContainer");

  function handleLeftMeeting() {
    // Show the form and hide the call container
    joinForm.style.display = "block";
    callContainer.style.display = "none";
    callFrame.destroy().then(() => {
      callFrame = null;
    });
  }

  function createAndJoinCall(e) {
    e.preventDefault();
    const dailyRoomUrl = e.target.url.value;
    callFrame = window.DailyIframe.createFrame(callContainer);
    callFrame.on("left-meeting", handleLeftMeeting);

    // Hide the form and show the call container
    joinForm.style.display = "none";
    callContainer.style.display = "block";

    try {
      callFrame.join({
        url: dailyRoomUrl,
        showLeaveButton: true,
      });
    } catch (e) {
      console.error(e);
    }
  }

  joinForm.onsubmit = createAndJoinCall;
});

/**
 * SCROLL EVENT: UPDATE VIDEO CALL ELEMENT SIZE ON SCROLL
 */

// Reusable throttle function for scroll event
function throttle(func, timeFrame) {
  var lastTime = 0;
  return function () {
    var now = new Date();
    if (now - lastTime >= timeFrame) {
      func();
      lastTime = now;
    }
  };
}

// Add the `scrolled` class when the window is scrolled
function handleScroll() {
  const scrollThreshold = 100; // px
  const callContainer = document.getElementById("dailyContainer");
  const scrollPosition = window.scrollY;
  const scrolled = callContainer.classList.contains("scrolled");

  // Don't update the class list if it's already marked correctly for its placement
  if (
    (scrolled && scrollPosition > scrollThreshold) ||
    (!scrolled && scrollPosition < scrollThreshold)
  ) {
    return;
  }
  // Remove scrolled class if it's scrolled back up
  else if (scrolled && scrollPosition < scrollThreshold) {
    callContainer.classList.remove("scrolled");
  }
  // Add scrolled class otherwise
  else {
    callContainer.classList.add("scrolled");
  }
}

document.addEventListener("scroll", throttle(handleScroll, 100));
