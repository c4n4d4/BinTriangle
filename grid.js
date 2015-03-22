/*
GNU GENERAL PUBLIC LICENSE, Version 2, June 1991 (license.txt)
Copyright by @c4n4d4, @Juribiyan, 0chan.cf, nullch.org, 0chan.hk and tracks/loops authors (for rights holders: write me about your stuff to c4n4d4@yandex.ru)
*/

var loops = [ 		//All loops was renamed from *.ogg in *.loop (troubles with copyrights LOL)
    { url: 'chrissu_and_rawfull_panorama.loop' },
    { url: 'crystal_castles_crimewave.loop' },
    { url: 'cutline_die_for_you_shock_one_remix.loop' },
    { url: 'london_elektricity_had_a_little_fight.loop' },
    { url: 'massive_attack_paradise_circus_zeds_dead_remix.loop' },
    { url: 'mata_beach_sand_original_mix.loop' },
    { url: 'metrik_your_world.loop' },
    { url: 'modified_motion_1up.loop' },
    { url: 'monsta_holdin_on_skrillex_and_nero_remix.loop' },
    { url: 'sigur_ros_saeglopur_enigma_remix.loop' },
];

var urlprefix = "/loops/"; 		//folder with loops

var Grid = {
    genGrid: function(h, v, pattern) {
        if(typeof pattern === 'undefined' || !pattern.length || pattern === 'void') pattern = [0];
        else { if(pattern === 'lit' || pattern == 1) pattern = [9]; 
        else { if(pattern === 'dim' || pattern == 1) pattern = [1]; } }
        pattern = pattern.toString().replace(/[^\da-f]/gmi, '');
        if(!pattern.length) pattern = '0';
        var html = '';
        var p = 0, x = 0, y = 0;
        for( ; y < v; y++) {
            for( ; x < h; x++) {
                if(p >= pattern.length) p = 0;
                html += '<div class="a-cell cell '+this.getClass(pattern[p])+'" '
                    +'id="cell_'+(y+1)+'_'+(x+1)+'" '
                    +'data-color="'+pattern[p]+'"></div>';
                    
                p++;
            }
            if(y !== (v-1)) html+='<br />';
            x = 0;
        }
        return html;
    },
    colorCodes: ['void', 'green', 'yellow', 'orange', 'blue', 'crimson', 'violet', 'mono'], 		//colour codes for index.php
    getClass: function(num) {
        if(parseInt(num, 16) > 15) return 'void';
        var cl = '';
        if(parseInt(num, 16)/8 >= 1) cl = 'lit '+this.colorCodes[parseInt(num, 16)-8];
        else cl = 'dim '+this.colorCodes[parseInt(num, 16)];
        return cl;
    },
    allColorCodes: function() {
        return this.colorCodes.join(' ') + ' dim lit';
    },
    derivePattern: function(scope) {
        var pattern = '';
        if(typeof scope === 'undefined') scope = '*';
        $(scope).find('.a-cell').each(function() {
            pattern += $(this).data('color');
        });
        return pattern;
    },
    getPrimaryColor: function(scope) {
        if(typeof scope === 'undefined') scope = '*';
        var weights = {};
        var pattern = this.derivePattern(scope).split('');
        iter(pattern, function(letter) {
            var color = Grid.getClass(letter).replace(/(lit|dim|( ))+/,'');
            if(typeof weights[color] === 'undefined') weights[color] = 0;
            weights[color]++;
        });
        var maxWeight = 0, primary = 'void';
        iter_obj(weights, function(key, value) {
            if(key !== 'void' && value >= maxWeight) {
                primary = key;
                maxWeight = value;
            }
        });
        return this.barColors[primary];
    },
    countActiveCells: function(scope) {
        if(typeof scope === 'undefined') scope = '*';
        var count = 0;
        var pattern = this.derivePattern(scope).split('');
        iter(pattern, function(letter) {
            var color = Grid.getClass(letter).replace(/(lit|dim|( ))+/,'');
            if(color !== 'void') count++;
        });
        return count;
    },
    barColors: { 		//colours for a grid
        green: '#59c44d',
        yellow: '#cccf41',
        orange: '#d2993e',
        blue: '#49b6c7',
        crimson: '#cc4368',
        violet: '#8238d8',
        mono: '#d2d2d2',
        void: '#d2d2d2'
    }
};

var pattern = defaultPattern;

var patternBuffer = pattern;

var brushcolor = false, brushcode = false, drawContext = {};

var isMouseDown = false;
$(document).ready(function() {
    $('body').mousedown(function() {
        isMouseDown = true;
    })
    .mouseup(function() {
        isMouseDown = false;
    });
    $('.brush').click(function() {
        $('.brush').removeClass('selected'); $(this).addClass('selected');
        brushcolor = Grid.getClass($(this).data('color'));
        brushcode = $(this).data('color');
    });

    $('#closePalette').click(function() {
        effect = true;
        brushcolor = false;
        $('#palette').slideUp();
        $('#nullgrid').removeClass('edit-mode');
        pattern = {
            x: $('#nullgrid').data('size').x,
            y: $('#nullgrid').data('size').y,
            pattern: Grid.derivePattern('#nullgrid')
        };
        bars.trimmingConstant = Math.floor(Math.sqrt(Grid.countActiveCells()));
        localStorage.setItem('customPattern', JSON.stringify(pattern));
    });
    $('#resampler').submit(function(event) {
        event.preventDefault();
        $('#nullgrid').resample( {
            x: $('#width').val(),
            y: $('#height').val(),
            pattern: $('#pattern').val()
        });
    });
    $('#getPattern').click(function() {
        $('#pattern').val(Grid.derivePattern('#nullgrid'));
        var size = $('#nullgrid').data('size');
        $('#width').val(size.x);
        $('#height').val(size.y);
    });
    $('#clearGrid').click(function() {
        $('#nullgrid').resample({pattern: '0'});
    });
    $('#reset').click(function() {
        $('#nullgrid').resample(defaultPattern);
    });
        
    $('#nullgrid').resample(pattern)
    .on("mouseenter", ".a-cell", function() { 
        if(isMouseDown && $(this).hasClass("a-cell") && brushcolor) {
            $(this).paint();
        }
        $(this).flash();
    })
    .on("mousedown", ".a-cell", function() {
        if(brushcolor) {
            $(this).paint();
        }
        $(this).flash();
    });
    
    var canvas = $('#bars');
    drawContext = canvas[0].getContext('2d');
    drawContext.fillStyle = Grid.getPrimaryColor();

    $('body').on('click', 'center a', function() {
        return false;
    });
});

function editmode() {		//function for turn patterns-edit mode (write in "F12 console": editmode();)
    $('#nullgrid').off('click');
    effect = false;
    $('#palette').slideDown();
    $('#nullgrid').addClass('edit-mode');
}

var fade = {in: 0, out: 300, await: 0};
var effect = true;

(function( $ ) {
    $.fn.flash = function() {
        if(effect === false || !this.length || this.hasClass('busy')) return;
        var self = this;
        self.addClass('busy');
        var color = Grid.getClass(self.data('color'));
        var popup = $('#pop'+self.attr('id'));
        if(!popup.length) {
            popup =  $("<div></div>").addClass("cell xpop").attr('id', 'pop'+self.attr('id'))
            .css({ display: 'none',
                position: 'absolute',
                left: self.position().left,
                top: self.position().top
            })
            .appendTo('#nullgrid');
        }
        popup.addClass(color+"-hov-shadow "+color+"-hov").fadeIn(fade.in, function() {
            setTimeout(function () {
                popup.removeClass(color+"-hov-shadow "+color+"-hov").fadeOut(fade.out, function() {
                    self.removeClass('busy');
                });
            }, fade.await);
        });
    };
    $.fn.resample = function(xyp) {
        var x = typeof xyp.x !== 'undefined' ? xyp.x : this.data('size').x;
        var y = typeof xyp.y !== 'undefined' ? xyp.y : this.data('size').y;
        this.html(Grid.genGrid(x, y, xyp.pattern)).data('size', {x: x, y: y});
        resampleLayers();
        drawContext.fillStyle = Grid.getPrimaryColor();
        bars.trimmingConstant = Math.floor(Math.sqrt(Grid.countActiveCells()));
        return this;
    }
}( jQuery ));

var audio = {
    buffer: {},
    compatibility: {},
    supported: true,
    source_loop: {},
    source_once: {},
    disabled: true
};

var currentLoop = {};
audio.loadLoop = function(immed, n) {
    audio.disabled = true;
    var newLoop = {};
    if(typeof n === 'number' && n < loops.length && n >= 0) {
        newLoop = loops[n];
        if (audio.source_loop._playing) {
            audio.source_loop[audio.compatibility.stop](0);
            audio.source_loop._playing = false;
            audio.source_loop._startTime = 0;
            if (audio.compatibility.start === 'noteOn') {
                audio.source_once[audio.compatibility.stop](0);
            }
        } 
    }
    else {
        var reduced = (loops.length == 1) ? loops : loops.filter(function(e){return e!==currentLoop});
        newLoop = reduced[Math.floor(Math.random() * reduced.length)];		//randomize loop
    }
	var req = new XMLHttpRequest();
    req.open('GET', urlprefix+newLoop.url, true);
    req.responseType = 'arraybuffer';
    req.onload = function() {
        $('#nullgrid').hover(audio.play,audio.stop);		//method for play and stop loops (default - hover)
        $('#nullgrid').resample(defaultPattern);		//pattern (customizable in index.php)
        audio.context.decodeAudioData(
            req.response,
            function(buffer) {
                if(newLoop.hasOwnProperty('treshold')) {
                    bars.treshold = newLoop.treshold;
                }
                else {
                    bars.treshold = bars.defaultTreshold;
                }
                audio.buffer = buffer;
                audio.source_loop = {};
                currentLoop  = newLoop;
                audio.disabled = false;
                if(immed) audio.play();
            }
        );
    };
    req.send();
}


try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audio.context = new window.AudioContext();
} catch(e) {
    audio.supported = false;
}

var visualizer = {};

if(audio.supported) {
    (function() {
        var start = 'start',
            stop = 'stop',
            buffer = audio.context.createBufferSource();
     
        if (typeof buffer.start !== 'function') {
            start = 'noteOn';
        }
        audio.compatibility.start = start;
     
        if (typeof buffer.stop !== 'function') {
            stop = 'noteOff';
        }
        audio.compatibility.stop = stop;
    })();
    
    audio.loadLoop(false);
    
    visualizer = new VisualizerSample();
}

audio.stop = function() {
    if(audio.disabled) return;
    audio.source_loop[audio.compatibility.stop](0);
    audio.source_loop._playing = false;
    audio.source_loop._startTime = 0;
    if (audio.compatibility.start === 'noteOn') {
        audio.source_once[audio.compatibility.stop](0);
    }
}

audio.play = function() {
    if(audio.disabled) return;
    if (audio.source_loop._playing) {
        audio.source_loop[audio.compatibility.stop](0);
        audio.source_loop._playing = false;
        audio.source_loop._startTime = 0;
        if (audio.compatibility.start === 'noteOn') {
            audio.source_once[audio.compatibility.stop](0);
        }
        $('.as-hidable').fadeOut(1000);
        audio.loadLoop(false);
    } 
    else {
        audio.source_loop = audio.context.createBufferSource();
        audio.source_loop.buffer = audio.buffer;
        audio.source_loop.loop = true;
        audio.source_loop.connect(visualizer.analyser);
 
        if (audio.compatibility.start === 'noteOn') {
            audio.source_once = audio.context.createBufferSource();
            audio.source_once.buffer = audio.buffer;
            audio.source_once.connect(visualizer.analyser);
            audio.source_once.noteGrainOn(0, 0, audio.buffer.duration);

            audio.source_loop[audio.compatibility.start](audio.buffer.duration);
        } else {
            audio.source_loop[audio.compatibility.start](0, 0);
        }
        audio.source_loop._playing = true;

        frame(visualizer.draw.bind(visualizer));
        
        $('.audiostuff').fadeIn(1000);
    }
    return false;
};

function resampleLayers() {
}

var frame = (function() {
return  window.requestAnimationFrame || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame    || 
	window.oRequestAnimationFrame      || 
	window.msRequestAnimationFrame     || 
	function( callback ) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var bars = {		//config of grid bar
	width: 850,
	height: 240,
	smoothing: 0.9,
	fft_size: 2048,
	treshold: 0.65,
    defaultTreshold: 0.65,
	trimmingConstant: 12,
};

function VisualizerSample() {
	this.analyser = audio.context.createAnalyser();

	this.analyser.connect(audio.context.destination);
	this.analyser.minDecibels = -100;
	this.analyser.maxDecibels = 0;

	this.times = new Uint8Array(this.analyser.frequencyBinCount);
}

var normalizer = 0;

VisualizerSample.prototype.draw = function() {
	this.analyser.smoothingTimeConstant = bars.smoothing;
	this.analyser.fftSize = bars.fft_size;
	this.analyser.getByteTimeDomainData(this.times);
    
        for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
		var value = this.times[i];
		var percent = value/256;
        
        if(percent > (bars.treshold - normalizer) && !(i % bars.trimmingConstant)) {
            $($('.a-cell')[ i + Math.floor(Math.random()*bars.trimmingConstant) ]).flash();		//math randomize grid-flashing
        }
		var height = bars.height * percent;
		var y = Math.ceil(bars.height - height);
	}
	if (audio.source_loop._playing) {
		frame(this.draw.bind(this));
	}
}


function iter(array, callback) {
    if(typeof array !== 'object') return callback(array);
    var i=0, len = array.length;
    for ( ; i < len ; i++ ) {
        callback(array[i]);
    }
}

function iter_obj(object, callback) {
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            callback(property, object[property]);
        }
    }
}
