
var prefix = window.addEventListener ? "" : "on";

//Drag Events
const DragEvent = {};
DragEvent.DRAG = prefix+'drag';
DragEvent.DRAG_END = prefix+'dragend';
DragEvent.DRAG_ENTER = prefix+'dragenter';
DragEvent.DRAG_LEAVE = prefix+'dragleave';
DragEvent.DRAG_OVER = prefix+'dragover';
DragEvent.DRAG_START = prefix+'dragstart';
DragEvent.DROP = prefix+'drop';

