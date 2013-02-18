/**
 * Provides the base Widget class xx...
 *
 * @module Component.Gallery.1
 */

Ink.createModule(
    'Ink.Component.Gallery', 1,
    ['Ink.Dom.Event_1', 'Ink.Dom.Css_1'],
    function(Event, Css) {

        // NOTICE THAT GALLERY ISN'T RETURING A CLASS CONSTRUCTOR BUT A SIMPLE FUNCTION
        return function(initialValue) {
            return {
                _value: initialValue || 0,

                getValue: function() { return this._value; },
                prev: function() { return --this._value; },
                next: function() { return ++this._value; }
            };
        };
        
    }
);