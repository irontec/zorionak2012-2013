/*
 * WS
 */
var socket; 
var wsPort = '8080';
var wsUrl = document.location.protocol + '//' + document.location.host + ':' + wsPort;

/*
 * Open Socket
 */

var reconnectCounter = 0;

$(document).ready(function(){

	socket = io.connect(wsUrl);
	
	/*
	 * Socket Events
	 */
	
	socket.on('connect', function (data) {});
	socket.on('disconnect', function(){});
	socket.on('reconnect', function(){});  
	socket.on('error', function () {});
	
	var BUTTONS;
	
	function formChange() {
		var $form = $('#form');
		for (var button in BUTTONS) {
			var $inp =$('input[name=but'+button+']', $form); 
			BUTTONS[button] = ($inp.is(':checked'))? 1:0;	
		}
		socket.emit('buttonsChange', BUTTONS);
	}
	
	function changePic($el) {
		var $img = $el.siblings('img');
		if ($el.is(':checked')) {
			var src = $img.attr('src').replace('Off', 'On');
			$img.attr('src', src);
		} else {
			var src = $img.attr('src').replace('On', 'Off');
			$img.attr('src', src);
		}
	}
	
	socket.on('counter', function (data) {
		$('#userCount').html(data.counter)
	});
	
	socket.on('buttons', function (data) {
		$('#userCount').html(data.counter)
		BUTTONS = data.buttons;
		var $form;
		if ($('#form').length<=0) {
			$form = $('<form />', {
				'id': 'form'
			});
			$('#switches').wrap($form);
			$('#switches img').each(function(i){
				var $lab = $('<label />', {
					'for':  'but' + i,
					'css': {'cursor':'pointer'},
					'click': function(){
						var $input = $(this).find('input');
						if (!$input.is(':checked')) {
							$input.attr('checked', true);
						} else {
							$input.attr('checked', false);
						}
						$inp.addClass('changed');
						$input.trigger('xchange');
						formChange();
						changePic($input);
					}
				});
				$(this).wrap($lab);
				var $inp = $('<input />', {
					'type': 'checkbox',
					'name': 'but' + i,
					'id': 'but' + i,
					'checked':(BUTTONS[i]==1),
					'style': 'display:none;'
				});
				$inp.insertBefore($(this));
				changePic($inp);
			});
		} else {
			$form = $('#form');
			for (var button in BUTTONS) {
				var $inp = $('#but' + button);
				$inp.attr('checked', (BUTTONS[button]==1));
				$inp.removeClass('changed');
				changePic($inp);
			}
		}
	});
});
