var canvas;
var ctx;
var content;
var image = new Image();

var mouse_x;
var mouse_y;
var current_box = -1;

var new_box = false;
var move = false;

image.load_image = load_image;
image.draw_image = draw_image;
image.draw_boxes = draw_boxes;
image.render = render;
image.push_box = push_box;
image.pop_box = pop_box;
image.get_index = get_index;
image.draw_shadow = draw_shadow;
image.change_cursor = change_cursor;

window.onload = function() {

	canvas = document.getElementById("canvas");
	content = document.getElementById("content");
	ctx = canvas.getContext("2d");

	init_canvas();
	image.load_image();

	canvas.oncontextmenu = function() {

		esc_handler();
		return false
	}

	canvas.onmousemove = function(event) {

		mouse_x = event.pageX - canvas.offsetLeft;
		mouse_y = event.pageY - canvas.offsetTop;

		current_box = image.change_cursor();

		mousemove_handler(mouse_x, mouse_y);
	}

	canvas.onclick = function(event) {

		mousedown_x = event.pageX - canvas.offsetLeft;
		mousedown_y = event.pageY - canvas.offsetTop;

		click_handler(mousedown_x, mousedown_y);

		current_box = image.change_cursor();
	}

	canvas.onmousewheel = function(event) {

		event.preventDefault();
		wheel_handler(event);
	}
}

window.onresize = function() {

	resize_canvas();
	image.render();
}

window.onkeydown = function(event) {

	event.preventDefault();
	var key = event.keyCode;

	if(key == 9) {

		tab_handler();
		return false;
	}

	else if(key == 27){

		esc_handler();
		return false;
	}

	else if(key == 65 || key == 37) {

		a_handler();
		return false;
	}

	else if(key == 68 || key == 39) {

		d_handler();
		return false;
	}

	else if(key == 81) {

		q_handler();
		return false;
	}

	else if(key == 83 && (event.ctrlKey || event.metaKey)) {

		save_handler();
        return false;
	}

	else if(key == 83 || key == 40) {

		s_handler();
		return false;
	}

	else if(key == 87 || key == 38) {

		w_handler();
		return false;
	}

	else if(key == 88) {

		x_handler();
		return false;
	}

	else if(key == 90) {

		z_handler();
		return false;
	}
}

function tab_handler() {

	if("active_box" in image && !new_box) {

		if(image.boxes.length == 0)
			return false;

		var index = image.get_index(image.active_box);

		if(index == image.boxes.length - 1)
			image.active_box = image.boxes[0].id;

		else
			image.active_box = image.boxes[++index].id;

		image.render();
	}
}

function esc_handler() {

	image.active_box = -1;
	new_box = false;
	image.render();
}

function a_handler() {

	if("active_box" in image) {

		if(image.active_box > -1) {

			var index = image.get_index(image.active_box);

			if(image.boxes[index].x - 0.5 * image.scale > 0) {

				image.boxes[index].x -= 0.5 * image.scale;
				image.render();
			}
		}
	}
}

function d_handler() {

	if("active_box" in image) {

		if(image.active_box > -1) {

			var index = image.get_index(image.active_box);

			if(image.boxes[index].x + 0.5 * image.scale + image.boxes[index].w < image.width) {

				image.boxes[index].x += 0.5 * image.scale;
				image.render();
			}
		}
	}
}

function q_handler() {

	if("active_box" in image) {

		var index = image.get_index(image.active_box);

		if(index < 0)
			return false;

		image.pop_box(image.active_box);

		if(image.boxes.length == 0)
			image.active_box = -1;

		else if(index == image.boxes.length)
			image.active_box = image.boxes[0].id;

		else
			image.active_box = image.boxes[index].id;

		image.render();
	}
}

function save_handler() {

	image.load_image();
    //send data to server
}

function s_handler() {

	if("active_box" in image) {

		if(image.active_box > -1) {

			var index = image.get_index(image.active_box);

			if(image.boxes[index].y + 0.5 * image.scale + image.boxes[index].h < image.height) {

				image.boxes[index].y += 0.5 * image.scale;
				image.render();
			}
		}
	}
}

function w_handler() {

	if("active_box" in image) {

		if(image.active_box > -1) {

			var index = image.get_index(image.active_box);

			if(image.boxes[index].y - 0.5 * image.scale > 0) {

				image.boxes[index].y -= 0.5 * image.scale;
				image.render();
			}
		}
	}
}

function x_handler() {

	if("active_box in image") {

		if(image.active_box > -1) {

			var index = image.get_index(image.active_box);

			var cx = image.boxes[index].x + 0.5 * image.boxes[index].w;
			var cy = image.boxes[index].y + 0.5 * image.boxes[index].h;

			if(image.boxes[index].w < 135) {

				image.boxes[index].w += 1.25 * image.scale;
				image.boxes[index].h += 0.5 * image.scale;

				image.boxes[index].x = cx - 0.5 * image.boxes[index].w;
				image.boxes[index].y = cy - 0.5 * image.boxes[index].h;

				image.render();
			}
		}

		else if(image.active_box == -2 && image.temp_box.w < 135) {

			var cx = image.temp_box.x + 0.5 * image.temp_box.w;
			var cy = image.temp_box.y + 0.5 * image.temp_box.h;

			image.temp_box.w += 1.25 * image.scale;
			image.temp_box.h += 0.5 * image.scale;

			image.temp_box.x = cx - 0.5 * image.temp_box.w;
			image.temp_box.y = cy - 0.5 * image.temp_box.h;

			image.render();
		}
	}
}

function z_handler() {

	if("active_box in image") {

		if(image.active_box > -1) {

			var index = image.get_index(image.active_box);

			var cx = image.boxes[index].x + 0.5 * image.boxes[index].w;
			var cy = image.boxes[index].y + 0.5 * image.boxes[index].h;

			if(image.boxes[index].w > 70) {

				image.boxes[index].w -= 1.25 * image.scale;
				image.boxes[index].h -= 0.5 * image.scale;

				image.boxes[index].x = cx - 0.5 * image.boxes[index].w;
				image.boxes[index].y = cy - 0.5 * image.boxes[index].h;

				image.render();
			}
		}

		else if(image.active_box == -2 && image.temp_box.w > 70) {

			var cx = image.temp_box.x + 0.5 * image.temp_box.w;
			var cy = image.temp_box.y + 0.5 * image.temp_box.h;

			image.temp_box.w -= 1.25 * image.scale;
			image.temp_box.h -= 0.5 * image.scale;

			image.temp_box.x = cx - 0.5 * image.temp_box.w;
			image.temp_box.y = cy - 0.5 * image.temp_box.h;

			image.render();
		}
	}
}

function mousemove_handler(x, y) {

	if(new_box){

		image.temp_box.move_box(x, y);
		image.render();
	}

	else if(image.active_box > -1 && move) {

		var index = image.get_index(image.active_box);
		image.boxes[index].move_box(x, y);
		image.render();
	}
}

function click_handler(cx, cy) {

	if(!new_box && current_box == -1) {

		new_box = true;

		x = cx / image.scale - 50;
		y = cy / image.scale - 20;
		w = 100;
		h = 40;

		image.temp_box = new Box(-2, x, y, w, h, image);

		image.active_box = -2;
	}

	else if(new_box) {

		new_box = false;
		image.temp_box.id = image.box_count;
		image.active_box = image.box_count;
		image.push_box(image.temp_box);
		image.temp_box = new Box(-2, 0, 0, 0, 0, image)
	}

	else {

		image.active_box = current_box;

		if(image.active_box > -1) {

			if(!move)
				move = true;

			else
				move = false;
		}
	}

	image.render();
}

function wheel_handler(event) {

	var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

	if(delta > 0)
		x_handler();

	else if(delta < 0)
		z_handler();
}

function change_cursor() {

	var box_id = -1;
	var scale = this.scale;

	var cursor_style = "cell";

	if(this.boxes.length > 0 && !new_box) {

		for(var i = 0; i < this.boxes.length; i++) {

			var x = Math.floor(this.boxes[i].x * scale);
			var y = Math.floor(this.boxes[i].y * scale);
			var w = Math.floor(this.boxes[i].w * scale);
			var h = Math.floor(this.boxes[i].h * scale);

			if(mouse_x > x + 5 && mouse_x < x + w -5 && mouse_y > y + 5 && mouse_y < y + h -5) {

				box_id = this.boxes[i].id;
				cursor_style = "pointer";
			}
		}

		if(move)
			cursor_style = "cell";
	}

	else if(new_box) {

		cursor_style = "cell";
		box_id = -2;
	}

	canvas.style.cursor = cursor_style;
	return box_id;
}

function init_canvas() {

	var width = content.clientWidth;
	var height = content.clientHeight;

	ctx.canvas.width = Math.round(0.85 * width);
	ctx.canvas.height = Math.round(0.8 * height);

	canvas.style.marginTop = Math.round(0.5 * (height - ctx.canvas.height)) + "px";
}

function resize_canvas() {

	var img_width = image.width;
	var img_height = image.height;

	var content_width = content.clientWidth;
	var content_height = content.clientHeight;

	var ratio = img_width / img_height;

	var height = content_height * 0.8;
	var width = height * ratio;

	if(width > 0.85 * content_width) {

		width = 0.85 * content_width;
		height = width / ratio;
	}

	image.scale = width / img_width;

	ctx.canvas.width = Math.round(width);
	ctx.canvas.height = Math.round(height);
	
	canvas.style.marginTop = Math.round(0.5 * (content_height - ctx.canvas.height)) + "px";
}

function load_image() {

	var random_num = Math.floor(Math.random() * 170);

	this.src = "./TestImages/test-" + random_num +".jpg";
	//this.src = "1.jpg";
	//get box data
	this.boxes = [];

	this.box_count = 0;
	current_box = -1
	//push boxess

	new_box = false;
	move = false;

	this.active_box = -1;
	this.temp_box = new Box(-2, 0, 0, 0, 0,this);

	var b1 = new Box(0, 20, 20, 50, 30, this);
	var b2 = new Box(1, 20, 60, 50, 30, this);

	//this.push_box(b1);
	//this.push_box(b2);

	this.onload = function() {

		resize_canvas();
		this.render();
	}
}

function draw_image() {

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.drawImage(this, 0, 0, ctx.canvas.width, ctx.canvas.height);
}

function draw_shadow() {

	if(this.active_box != -1) {

		var box;

		if(this.active_box == -2 && new_box)
			box = this.temp_box;

		else {
			var index = this.get_index(this.active_box);
			box = this.boxes[index];
		}

		scale = this.scale;

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, ctx.canvas.width, Math.round(box.y * scale));
		ctx.fillRect(0, Math.round(box.y * scale), Math.round(box.x * scale), ctx.canvas.height);
		ctx.fillRect(Math.round((box.x + box.w) * scale), Math.round(box.y * scale), ctx.canvas.width, ctx.canvas.height);
		var w = Math.round((box.x + box.w) * scale) - Math.round(box.x * scale);
		ctx.fillRect(Math.round(box.x * scale), Math.round((box.y + box.h) * scale), w, ctx.canvas.height);
	}
}

function draw_boxes() {

	for(var i = 0; i < this.boxes.length; i++)
		this.boxes[i].draw();

	if(this.active_box == -2 && new_box)
		this.temp_box.draw();
}

function render() {

	this.draw_image();
	this.draw_shadow();
	this.draw_boxes();
}

function Box(id, x, y, w, h, image) {

	this.id = id;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.image = image

	this.draw = draw;
	this.move_box = move_box;
}

function draw() {

	var scale = this.image.scale;

	var x = Math.round(this.x * scale);
	var y = Math.round(this.y * scale);
	var w = Math.round(this.w * scale);
	var h = Math.round(this.h * scale);

	ctx.lineWidth = 3;

	if(this.id == -2)
		ctx.strokeStyle = "#0000ff";

	else if(this.id == this.image.active_box && !move)
		ctx.strokeStyle = "#00ff00";

	else if(this.id == this.image.active_box && move)
		ctx.strokeStyle = "#0000ff";

	else
		ctx.strokeStyle = "#ffff00";

	ctx.strokeRect(x, y, w ,h);
}

function move_box(x, y) {

	var temp_x = x / scale - 0.5 * this.w;
	var temp_y = y / scale - 0.5 * this.h;

	if(temp_x > 0)
		this.x = temp_x;

	else
		this.x = 0;

	if(temp_x + this.w > this.image.width)
		this.x = this.image.width - this.w;

	if(temp_y > 0)
		this.y = temp_y;

	else
		this.y = 0;

	if(temp_y + this.h > this.image.height)
		this.y = this.image.height - this.h;
}

function push_box(box) {

	this.boxes.push(box);
	this.box_count++;
}

function pop_box(box_id) {

	var index = this.get_index(box_id);

	if(index == -1)
		return false;

	if(index == this.boxes.length - 1) {
		this.boxes = this.boxes.slice(0, index);
	}

	else {

		arr1 = this.boxes.slice(0, index);
		arr2 = this.boxes.slice(index + 1, this.boxes.length);
		this.boxes = arr1.concat(arr2);
	}
}

function get_index(box_id) {

	var index = -1;

	for(var i = 0; i < this.boxes.length; i++) {

		if(this.boxes[i].id == box_id) {

			index = i;
			break;
		}
	}

	return index;
}