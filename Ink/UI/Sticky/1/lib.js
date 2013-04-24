Ink.createModule('Ink.UI.Sticky', '1', ['Ink.UI.Aux_1','Ink.Dom.Event_1','Ink.Dom.Css_1','Ink.Dom.Element_1','Ink.Dom.Selector_1'], function(Aux, Event, Css, Element, Selector ) {
    'use strict';

    var Sticky = function( selector, options ){

        if( typeof selector !== 'object' && typeof selector !== 'string'){
            throw '[Sticky] :: Invalid selector defined';
        }

        if( typeof selector === 'object' ){
            this._rootElement = selector;
        } else {
            this._rootElement = Selector.select( selector );
            if( this._rootElement.length <= 0) {
                throw "[Sticky] :: Can't find any element with the specified selector";
            }
            this._rootElement = this._rootElement[0];
        }

        /**
         * Setting default options and - if needed - overriding it with the data attributes
         */
        this._options = Ink.extendObj({
            offsetBottom: 0,
            offsetTop: 0,
            topElement: undefined,
            bottomElement: undefined
        }, Element.data( this._rootElement ) );

        /**
         * In case options have been defined when creating the instance, they've precedence
         */
        this._options = Ink.extendObj(this._options,options || {});

        if( typeof( this._options.topElement ) !== 'undefined' ){
            this._options.topElement = Aux.elOrSelector( this._options.topElement, 'Top Element');
        } else {
            this._options.topElement = Aux.elOrSelector( 'body', 'Top Element');
        }

        if( typeof( this._options.bottomElement ) !== 'undefined' ){
            this._options.bottomElement = Aux.elOrSelector( this._options.bottomElement, 'Bottom Element');
        } else {
            this._options.bottomElement = Aux.elOrSelector( 'body', 'Top Element');
        }

        this._computedStyle = window.getComputedStyle ? window.getComputedStyle(this._rootElement, null) : this._rootElement.currentStyle;
        this._init();
    };

    Sticky.prototype = {


        _init: function(){
            Event.observe( document, 'scroll', Ink.bindEvent(this._onScroll,this) );
            Event.observe( window, 'resize', Ink.bindEvent(this._onResize,this) );

            this._options.originalOffsetTop = parseInt(this._options.offsetTop,10);
            this._options.originalOffsetBottom = parseInt(this._options.offsetBottom,10);
            this._options.originalTop = parseInt(this._rootElement.offsetTop,10);
            this._options.originalWidth = parseInt(this._computedStyle.width,10);

            this._calculateOffsets();

        },

        _onScroll: function(){


            var viewport = (document.compatMode === "CSS1Compat") ?  document.documentElement : document.body;

            if( ( (Element.elementWidth(this._rootElement)*100)/viewport.clientWidth ) > 90 ){
                if( Element.hasAttribute(this._rootElement,'style') ){
                    this._rootElement.removeAttribute('style');
                }
                return;
            }


            if( this._scrollTimeout ){
                clearTimeout(this._scrollTimeout);
            }

            this._scrollTimeout = setTimeout(Ink.bind(function(){

                if( Element.hasAttribute(this._rootElement,'style') ){
                    if( window.scrollY<=this._options.offsetTop){
                        this._rootElement.removeAttribute('style');
                    } else if( ((document.body.scrollHeight-(window.scrollY+parseInt(this._computedStyle.height,10))) < this._options.offsetBottom) ){
                        this._rootElement.style.position = 'fixed';
                        this._rootElement.style.top = 'auto';
                        if( this._options.offsetBottom < parseInt(document.body.scrollHeight - (document.documentElement.clientHeight+window.scrollY),10) ){
                            this._rootElement.style.bottom = this._options.originalOffsetBottom + 'px';
                        } else {
                            this._rootElement.style.bottom = this._options.offsetBottom - parseInt(document.body.scrollHeight - (document.documentElement.clientHeight+window.scrollY),10) + 'px';
                        }
                        this._rootElement.style.width = this._options.originalWidth + 'px';
                    } else if( ((document.body.scrollHeight-(window.scrollY+parseInt(this._computedStyle.height,10))) >= this._options.offsetBottom) ){
                        this._rootElement.style.position = 'fixed';
                        this._rootElement.style.bottom = 'auto';
                        this._rootElement.style.top = this._options.originalOffsetTop + 'px';
                        this._rootElement.style.width = this._options.originalWidth + 'px';
                    }
                } else {
                    if( window.scrollY <= this._options.offsetTop ){
                        return;
                    }

                    this._rootElement.style.position = 'fixed';
                    this._rootElement.style.bottom = 'auto';
                    this._rootElement.style.top = this._options.offsetTop + 'px';
                    this._rootElement.style.width = this._options.originalWidth + 'px';
                }

                this._scrollTimeout = undefined;
            },this),0);
        },

        _onResize: function(){

            if( this._resizeTimeout ){
                clearTimeout(this._resizeTimeout);
            }

            this._resizeTimeout = setTimeout(Ink.bind(function(){

                this._calculateOffsets();

            },this),250);

        },

        _calculateOffsets: function(){

            /**
             * Calculating the offset top
             */
            if( typeof this._options.topElement !== 'undefined' ){


                if( this._options.topElement.nodeName.toLowerCase() !== 'body' ){
                    var
                        topElementHeight = Element.elementHeight( this._options.topElement ),
                        topElementTop = Element.elementTop( this._options.topElement )
                    ;

                    this._options.offsetTop = ( parseInt(topElementHeight,10) + parseInt(topElementTop,10) ) + parseInt(this._options.originalOffsetTop,10);
                } else {
                    this._options.offsetTop = parseInt(this._options.originalOffsetTop,10);
                }
            }

            /**
             * Calculating the offset bottom
             */
            if( typeof this._options.bottomElement !== 'undefined' ){

                if( this._options.bottomElement.nodeName.toLowerCase() !== 'body' ){
                    var
                        bottomElementHeight = Element.elementHeight(this._options.bottomElement)
                    ;
                    this._options.offsetBottom = parseInt(bottomElementHeight,10) + parseInt(this._options.originalOffsetBottom,10);
                } else {
                    this._options.offsetBottom = parseInt(this._options.originalOffsetBottom,10);
                }
            }

            this._onScroll();

        },

        _destroy: function(){

        }

    };

    return Sticky;

});
