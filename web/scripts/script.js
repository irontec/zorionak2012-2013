/*
* zorionak  again    
* Copyright (c) 2012, Irontec S.L.
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 2 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program; if not, write to the Free Software
* Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301 USA
*/


$(document).ready(function() {
    $("body").css("-khtml-user-select","none").css("-moz-user-select","none");
    var $stream = $("#stream");
    $("#fps").html("0.88 FPS");    
    (function launch() {
        var loader = $("<img />");
	    loader.attr("src","http://zorionak.irontec.com/live/current.jpeg?_="+Math.random(99));
  	    loader.on("load",function() {
		    $("#fps").html((1+parseInt(Math.random(9)*100)/100).toString().substr(0,4) + " FPS");
    		$(this).appendTo($stream);
    		$("img:eq(0)",$stream).fadeOut(75,function() {
    			$(this).remove();
    			launch();
    		});
    	});
    })();
});

