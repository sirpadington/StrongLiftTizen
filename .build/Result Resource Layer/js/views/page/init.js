/*global define, $, console, window, history, document, tau*/

/**
 * Init page module
 */

define({
    name: 'views/page/init',
    requires: [   
        'core/event',
        'core/template',
        'core/systeminfo',
        'core/application',
        'core/storage/idb',
        'views/page/main'
    ],
    def: function viewsPageInit(req) {
        'use strict';

        var e = req.core.event,
            idb = req.core.storage.idb,
            app = req.core.application,
            sysInfo = req.core.systeminfo;

        /**
         * Exits the application, waiting first for pending storage requests
         * to complete.
         */
        function exit() {
            e.fire('application.exit');
            if (!idb.hasPendingRequests()) {
                app.exit();
            } else {
                e.listen('core.storage.idb.completed', app.exit);
            }
        }

        /**
         * Handles tizenhwkey event.
         * @param {event} ev
         */
        function onHardwareKeysTap(ev) {
            var keyName = ev.keyName;
	 	    var pageid = $('.ui-page-active').first().attr('id');

            if (keyName === 'back') {
            	handleNavigationEvent(pageid);
            }
        }
        
        function handleNavigationEvent(pageid){
		    if( pageid === "main" ) 
		    {
			    tizen.application.getCurrentApplication().exit();
		    } 
		    else 
		    {
			    showMain();
		    }	   
        }
        

	    function showMain(){
		    $(".ui-page").each(function(index, value){
			    $(this).removeClass("ui-page-active");
		    });
		    $("#main").addClass("ui-page-active");
	    }    

        /**
         * Handles resize event.
         */
        function onWindowResize() {
            e.fire('window.resize', { height: window.innerHeight });
        }

        /**
         * Handler onLowBattery state
         */
        function onLowBattery() {
            if (document.getElementsByClassName('ui-page-active')[0].id ===
            'register') 
            {
	            e.fire('register.menuBack');
	        }
	        exit();
        }

        /**
         * Registers event listeners.
         */
        function bindEvents() {
    	    $('body').dblclick(function(){
    		    handleNavigationEvent();
    	    });
        	
            window.addEventListener('tizenhwkey', onHardwareKeysTap);
            sysInfo.listenBatteryLowState();
        }

        /**
         * Initializes module.
         */
        function init() {
            // bind events to page elements
            bindEvents();
        }

        e.on({
            'core.systeminfo.battery.low': onLowBattery
        });

        return {
            init: init
        };
    }

});
