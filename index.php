<!--
GNU GENERAL PUBLIC LICENSE, Version 2, June 1991 (license.txt)
Copyright by @c4n4d4, @Juribiyan, 0chan.cf, nullch.org, 0chan.hk (for rights holders: write me about yours stuff to c4n4d4@yandex.ru)
-->

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>BinTriangle</title>
	<script type="text/javascript">
	var defaultPattern = { pattern: 
	"0000000000000000000000006000000000000000000000000000000000000000000000006e600000000000000000000000000000000000000000000006e60000000000000000000000000000000000000000000006eee6000000000000000000000000000000000000000000006eee60000000000000000000000dddd000000000ddddd0006eeeee6000000000000000000000d000d0d00000000d000006eedee600000000000000d000000d000d000ddd0000d000dddeeeeddd000ddd000dd00d000dd0dddd00d0d00d000d000d6ededeee6d00d00d0d00d0d00d00dd000d0d0d00d000d000deeeedeeddd00d00d0d00d0d00d00dd000d0d0d00d000d000deeeededeed00d00d0d00d0d00ddd0d000d0d0d00d000d006deeeededeed60d00d0d00d0d00d000dddd00d0d00d000d006deeeedeedded0d00d00ddd00d00ddd000000000000000006eeeeeeeeeeeee600000000d00000000000000000000000006eeeeeeeeeeeee6000000dd00000000000000000000000006eeeeeeeeeeeeeee6000000000000000000000000000000006eeeeeeeeeeeeeee600000000000000000000000000000006eeeeeeeeeeeeeeeee60000000000000000000000000000006eeeeeeeeeeeeeeeee60000000000000000000000000000066666666666666666666600000000000000", x: 49, y: 20 }; 
	</script>
	<link href="style.css" media="all" rel="stylesheet" type="text/css">
	<script src="//code.jquery.com/jquery-1.11.2.min.js"
    if (!window.jQuery) {
        document.write('<script src="/lib/js/jquery-1.11.2.min.js"><\/script>');
    }
    </script>
	<script src="grid.js"></script>
</head>
<body><br><br><br><br>
    <div id="gridwrap">
	    <div id="nullgrid"></div>
	</div>
    </div>
    <div id="palette" style="display:none">
        <div class="palette-block" id="colors">
            <div data-color="9" class="brush lit green"></div>
            <div data-color="1" class="brush dim green"></div>
            <div data-color="a" class="brush lit yellow"></div>
            <div data-color="2" class="brush dim yellow"></div>
            <div data-color="b" class="brush lit orange"></div>
            <div data-color="3" class="brush dim orange"></div>
            <div data-color="f" class="brush lit mono"></div>
            <div data-color="7" class="brush dim mono"></div><br
            
           ><div data-color="d" class="brush lit crimson"></div>
            <div data-color="5" class="brush dim crimson"></div>
            <div data-color="e" class="brush lit violet"></div>
            <div data-color="6" class="brush dim violet"></div>
            <div data-color="c" class="brush lit blue"></div>
            <div data-color="4" class="brush dim blue"></div>
            <div class="pal-btn brush" id="eraser" data-color="0"></div>
        </div>
        <form action="#" class="palette-block" id="resampler">
        	<input type="number" min="1" value="14" id="width"><span id="multiplier">×</span><input type="number" min="1" value="18" id="height">
        	<input type="submit" class="pal-btn" value="Draw">
        	<input type="button" id="reset" class="pal-btn" value="Reset">
        	<input type="button" id="clearGrid" class="pal-btn" value="Clear Grid"><br
        	
           ><input type="text" id="pattern">
        	<input type="button" id="getPattern" class="pal-btn" value="Get Pattern">
        	<input type="button" id="closePalette" class="pal-btn" value="Close">
        </form>
    </div>
	</body>
</html>
