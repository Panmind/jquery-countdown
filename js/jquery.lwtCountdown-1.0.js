/*!
 * jQuery Countdown plugin v1.0
 * http://www.littlewebthings.com/projects/countdown/
 *
 * Copyright 2010, Vassilis Dourdounis
 * Copyright 2010, Marcello Barnaba <marcello.barnaba@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function($) {

	$.fn.countDown = function (options) {
		// Public methods invocation
		//
		if (typeof options == 'string') {
			return $(this).data('countDown')[options].apply(this) || this;
		}

		return this.each (function () {
			// Initialization
			//
			var element = $(this), targetTime = new Date(), timer;

			if (element.data ('countDown'))
				return; // Already initialized

			if (options.targetDate)
			{
				targetTime = new Date(
					options.targetDate.month + '/' + options.targetDate.day + '/' + options.targetDate.year + ' ' +
					options.targetDate.hour + ':' + options.targetDate.min + ':' + options.targetDate.sec +
					(options.targetDate.utc ? ' UTC' : '')
				);
			}
			else if (options.targetOffset)
			{
				targetTime.setFullYear(options.targetOffset.year + targetTime.getFullYear());
				targetTime.setMonth(options.targetOffset.month   + targetTime.getMonth());
				targetTime.setDate(options.targetOffset.day      + targetTime.getDate());
				targetTime.setHours(options.targetOffset.hour    + targetTime.getHours());
				targetTime.setMinutes(options.targetOffset.min   + targetTime.getMinutes());
				targetTime.setSeconds(options.targetOffset.sec   + targetTime.getSeconds());
			}

			element.find('.digit').html('<div class="top"></div><div class="bottom"></div>');

			// Public methods definition
			//
			element.data ('countDown', {
				stop: function () {
					if (timer == undefined)
						return;

					clearInterval(timer);
					timer = undefined
				},

				start: function () {
					if (timer != undefined)
						return;

					var diffSecs = Math.floor((+targetTime - +new Date())/1000);
					var duration = 500;

					timer = setInterval (function () {
						if (diffSecs <= 0) {
							stop ();

							if (options.onComplete)
								options.onComplete.apply(element);
							return;
						}

						secs = diffSecs % 60;
						mins = Math.floor(diffSecs/60)%60;
						hours = Math.floor(diffSecs/60/60)%24;
						if (options.omitWeeks)
						{
							days = Math.floor(diffSecs/60/60/24);
							weeks = Math.floor(diffSecs/60/60/24/7);
						}
						else
						{
							days = Math.floor(diffSecs/60/60/24)%7;
							weeks = Math.floor(diffSecs/60/60/24/7);
						}

						dashChangeTo('.seconds_dash', secs,  duration);
						dashChangeTo('.minutes_dash', mins,  duration);
						dashChangeTo('.hours_dash',   hours, duration);
						dashChangeTo('.days_dash',    days,  duration);
						dashChangeTo('.weeks_dash',   weeks, duration);

						diffSecs -= 1;
					}, 1000);
				}
			});

			// Private method to update a single digit couple
			//
			function dashChangeTo (selector, n, duration) {
				element.find (selector + ' .digit').each (function (i) {
					// The first digit is i=0, the second i=1
					digitChangeTo($(this), i == 0 ? Math.floor(n/10) : n%10, duration);
				})
			};

			// Private method to update a single digit
			//
			function digitChangeTo (digit, n, duration) {
				var top = digit.find('.top'),
						bot = digit.find('.bottom');

				if (top.html() != n + '')
				{
					top.html(n || '0').slideDown(duration);

					bot.animate({height: 0}, duration, function() {
						bot.html(n || '0').css({height: '100%'});
						top.hide();
					});
				}
			};

			element.data('countDown').start();
		});
	};

})(jQuery);
