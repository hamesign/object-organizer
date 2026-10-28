#target illustrator

function main() {
    if (app.documents.length === 0) {
        alert("Error: No document open.");
        return;
    }
    
    var mainDoc = app.activeDocument;
    var selection = mainDoc.selection;
    
    if (selection.length === 0) {
        alert("Error: Please select logo/vector items first.");
        return;
    }
    
    var totalObjects = selection.length;
    var mmToPt = 2.83464567;
    var defaultCols = Math.ceil(Math.sqrt(totalObjects));
    var defaultRows = Math.ceil(totalObjects / defaultCols);

    // --- ARTBOARD READ ---
    var activeAB = mainDoc.artboards[mainDoc.artboards.getActiveArtboardIndex()];
    var abRect = activeAB.artboardRect; 
    var abW = Math.abs(abRect[2] - abRect[0]);
    var abH = Math.abs(abRect[1] - abRect[3]);

    var workingObjects = [];
    for (var i = 0; i < selection.length; i++) {
        workingObjects.push(selection[i]);
    }

    var previewGroup = null;

    // --- COLOR LIST & POSITIONS ---
    var colorList = ["Light Gray", "White", "Black", "Dark Gray", "Red", "Blue", "Green"];
    var posList = ["Top Left", "Top Right", "Bottom Left", "Bottom Right"];

    // --- DIALOG UI (COMPACT SIDE-BY-SIDE) ---
    var dialog = new Window("dialog", "Object Organizer");
    dialog.orientation = "column";
    dialog.alignChildren = ["fill", "top"];
    dialog.spacing = 10;
    dialog.margins = 14;

    // Kontainer Utama untuk membagi 2 Kolom (Kiri & Kanan)
    var mainColumnsGroup = dialog.add("group");
    mainColumnsGroup.orientation = "row";
    mainColumnsGroup.alignChildren = ["fill", "top"];
    mainColumnsGroup.spacing = 12;

    // ==========================================
    // KOLOM KIRI (Struktur, Jarak & Skala Objek, Nomor)
    // ==========================================
    var leftColumn = mainColumnsGroup.add("group");
    leftColumn.orientation = "column";
    leftColumn.alignChildren = ["fill", "top"];
    leftColumn.spacing = 8;
    leftColumn.preferredSize.width = 260;

    // Panel 1: Grid Structure
    var gridPanel = leftColumn.add("panel", undefined, "1. Grid Structure");
    gridPanel.orientation = "column";
    gridPanel.alignChildren = ["left", "top"];
    gridPanel.spacing = 6;
    gridPanel.margins = 10;

    var rowColGroup = gridPanel.add("group");
    rowColGroup.orientation = "row";
    rowColGroup.spacing = 8;

    rowColGroup.add("statictext", undefined, "Rows:");
    var inputRows = rowColGroup.add("edittext", undefined, String(defaultRows)); 
    inputRows.preferredSize.width = 35;
    
    rowColGroup.add("statictext", undefined, "   Cols:");
    var inputCols = rowColGroup.add("edittext", undefined, String(defaultCols)); 
    inputCols.preferredSize.width = 35;

    // Panel 2: Spacing & Object Scaling
    var spacePanel = leftColumn.add("panel", undefined, "2. Spacing & Object Scaling");
    spacePanel.orientation = "column";
    spacePanel.alignChildren = ["left", "top"];
    spacePanel.spacing = 6;
    spacePanel.margins = 10;

    var gGroup = spacePanel.add("group");
    var lblGutter = gGroup.add("statictext", undefined, "Gutter (mm):");
    lblGutter.preferredSize.width = 140;
    var inputGutter = gGroup.add("edittext", undefined, "0"); 
    inputGutter.preferredSize.width = 45;

    var mGroup = spacePanel.add("group");
    var lblMargin = mGroup.add("statictext", undefined, "Cell Inset (mm):");
    lblMargin.preferredSize.width = 140;
    var inputMargin = mGroup.add("edittext", undefined, "1"); 
    inputMargin.preferredSize.width = 45;

    var amGroup = spacePanel.add("group");
    var lblArtMargin = amGroup.add("statictext", undefined, "Artboard Margin (mm):");
    lblArtMargin.preferredSize.width = 140;
    var inputArtMargin = amGroup.add("edittext", undefined, "0"); 
    inputArtMargin.preferredSize.width = 45;

    // Panel 3: Cell Numbers
    var numPanel = leftColumn.add("panel", undefined, "3. Cell Numbers");
    numPanel.orientation = "column";
    numPanel.alignChildren = ["left", "top"];
    numPanel.spacing = 6;
    numPanel.margins = 10;

    var checkAddNumbers = numPanel.add("checkbox", undefined, "Add Cell Numbers");
    checkAddNumbers.value = true;

    var numSettingsGroup = numPanel.add("group");
    numSettingsGroup.orientation = "column";
    numSettingsGroup.alignChildren = ["left", "top"];
    numSettingsGroup.spacing = 6;

    var rowPos = numSettingsGroup.add("group");
    var lblPos = rowPos.add("statictext", undefined, "Position:");
    lblPos.preferredSize.width = 65;
    var dropNumPos = rowPos.add("listbox", undefined, posList, {dropdown: true});
    dropNumPos.preferredSize.width = 100;
    dropNumPos.selection = 0; 

    var rowSizeOffset = numSettingsGroup.add("group");
    rowSizeOffset.orientation = "row";
    rowSizeOffset.spacing = 6;

    rowSizeOffset.add("statictext", undefined, "Size (pt):");
    var inputNumSize = rowSizeOffset.add("edittext", undefined, "22");
    inputNumSize.preferredSize.width = 30;

    rowSizeOffset.add("statictext", undefined, " Offset (mm):");
    var inputNumOffset = rowSizeOffset.add("edittext", undefined, "7");
    inputNumOffset.preferredSize.width = 30;


    // ==========================================
    // KOLOM KANAN (Warna Papan Catur)
    // ==========================================
    var rightColumn = mainColumnsGroup.add("group");
    rightColumn.orientation = "column";
    rightColumn.alignChildren = ["fill", "top"];
    rightColumn.spacing = 8;
    rightColumn.preferredSize.width = 310;

    // Panel 4: Checkerboard Colors
    var colorPanel = rightColumn.add("panel", undefined, "4. Checkerboard Colors");
    colorPanel.orientation = "column";
    colorPanel.alignChildren = ["left", "top"];
    colorPanel.spacing = 6;
    colorPanel.margins = 10;

    var checkColor = colorPanel.add("checkbox", undefined, "Enable Checkerboard BG");
    // PERBAIKAN: Mengubah nilai default dari true menjadi false (off)
    checkColor.value = false;

    var checkAutoContrast = colorPanel.add("checkbox", undefined, "Enable Auto-Contrast Logo Color");
    checkAutoContrast.value = true;

    var contrastModeGroup = colorPanel.add("group");
    contrastModeGroup.orientation = "row";
    contrastModeGroup.spacing = 10;

    var radioInvert = contrastModeGroup.add("radiobutton", undefined, "Cross Color (A <-> B)");
    var radioBW = contrastModeGroup.add("radiobutton", undefined, "Black / White");
    radioInvert.value = true; 

    var dropdownGroup = colorPanel.add("group");
    dropdownGroup.orientation = "row";
    dropdownGroup.spacing = 8;

    var colAGroup = dropdownGroup.add("group");
    colAGroup.orientation = "column";
    colAGroup.alignChildren = ["left", "center"];
    colAGroup.spacing = 4;
    
    var rowASelect = colAGroup.add("group");
    var lblColorA = rowASelect.add("statictext", undefined, "Color A:");
    lblColorA.preferredSize.width = 45;
    var dropColorA = rowASelect.add("listbox", undefined, colorList, {dropdown: true});
    dropColorA.preferredSize.width = 95;
    
    var rowAHex = colAGroup.add("group");
    var lblHexA = rowAHex.add("statictext", undefined, "Hex A: #");
    lblHexA.preferredSize.width = 45;
    var inputHexA = rowAHex.add("edittext", undefined, "");
    inputHexA.preferredSize.width = 95;

    var colBGroup = dropdownGroup.add("group");
    colBGroup.orientation = "column";
    colBGroup.alignChildren = ["left", "center"];
    colBGroup.spacing = 4;
    
    var rowBSelect = colBGroup.add("group");
    var lblColorB = rowBSelect.add("statictext", undefined, "Color B:");
    lblColorB.preferredSize.width = 45;
    var dropColorB = rowBSelect.add("listbox", undefined, colorList, {dropdown: true});
    dropColorB.preferredSize.width = 95;
    
    var rowBHex = colBGroup.add("group");
    var lblHexB = rowBHex.add("statictext", undefined, "Hex B: #");
    lblHexB.preferredSize.width = 45;
    var inputHexB = rowBHex.add("edittext", undefined, "");
    inputHexB.preferredSize.width = 95;

    dropColorA.selection = 2; 
    dropColorB.selection = 1;


    // ==========================================
    // BARIS BAWAH (Live Preview, Cancel, OK)
    // ==========================================
    var bottomBarGroup = dialog.add("group");
    bottomBarGroup.orientation = "row";
    bottomBarGroup.alignChildren = ["center", "center"];
    bottomBarGroup.spacing = 10;
    bottomBarGroup.margins = 0; 

    var checkPreview = bottomBarGroup.add("checkbox", undefined, "Enable Live Preview");
    checkPreview.value = true;
    
    var spacer = bottomBarGroup.add("group");
    spacer.preferredSize.width = 170;

    var btnGroup = bottomBarGroup.add("group");
    btnGroup.orientation = "row";
    btnGroup.spacing = 8;
    var btnCancel = btnGroup.add("button", undefined, "Cancel", {name: "cancel"});
    var btnOk = btnGroup.add("button", undefined, "OK", {name: "ok"});

    // --- COLOR UTILITIES ---
    function getColorObject(colorName) {
        var rgbColor = new RGBColor();
        if (colorName === "Light Gray") { rgbColor.red = 220; rgbColor.green = 220; rgbColor.blue = 220; }
        else if (colorName === "White") { rgbColor.red = 255; rgbColor.green = 255; rgbColor.blue = 255; }
        else if (colorName === "Black") { rgbColor.red = 0; rgbColor.green = 0; rgbColor.blue = 0; }
        else if (colorName === "Dark Gray") { rgbColor.red = 60; rgbColor.green = 60; rgbColor.blue = 60; }
        else if (colorName === "Red") { rgbColor.red = 230; rgbColor.green = 30; rgbColor.blue = 30; }
        else if (colorName === "Blue") { rgbColor.red = 30; rgbColor.green = 100; rgbColor.blue = 230; }
        else if (colorName === "Green") { rgbColor.red = 40; rgbColor.green = 180; rgbColor.blue = 100; }
        else { rgbColor.red = 255; rgbColor.green = 255; rgbColor.blue = 255; }
        return rgbColor;
    }

    function hexToRgb(hexStr) {
        hexStr = String(hexStr).replace(/^\s+|\s+$/g, '');
        if (hexStr === "") return null;
        if (hexStr.charAt(0) === "#") hexStr = hexStr.substring(1);
        if (!/^[0-9A-Fa-f]{6}$/.test(hexStr)) return false;
        
        var r = parseInt(hexStr.substring(0, 2), 16);
var g = parseInt(hexStr.substring(2, 4), 16);
var b = parseInt(hexStr.substring(4, 6), 16);
var rgbColor = new RGBColor();
rgbColor.red = r;
rgbColor.green = g;
rgbColor.blue = b;
return rgbColor;
}
function isColorObjDark(rgbObj) {
var brightness = Math.sqrt(
0.299 * (rgbObj.red * rgbObj.red) +
0.587 * (rgbObj.green * rgbObj.green) +
0.114 * (rgbObj.blue * rgbObj.blue)
);
return brightness < 130;
}
function isDarkColorName(colorName) {
if (colorName === "Black" || colorName === "Dark Gray" || colorName === "Red" || colorName === "Blue" || colorName === "Green") {
return true;
}
return false;
}
function RecolorToFlat(item, targetColor) {
if (item.typename === "PathItem") {
if (item.filled) item.fillColor = targetColor;
if (item.stroked) item.strokeColor = targetColor;
} else if (item.typename === "CompoundPathItem") {
if (item.pathItems.length > 0) {
for (var p = 0; p < item.pathItems.length; p++) {
RecolorToFlat(item.pathItems[p], targetColor);
}
}
} else if (item.typename === "GroupItem") {
for (var g = 0; g < item.pageItems.length; g++) {
RecolorToFlat(item.pageItems[g], targetColor);
}
} else if (item.typename === "TextFrame") {
item.textRange.characterAttributes.fillColor = targetColor;
}
}
// --- GRID LOGIC ---
function executeGridLogic(targetDoc, isFinal) {
var rowsText = String(inputRows.text).replace(/^\s+|\s+$/g, '');
var colsText = String(inputCols.text).replace(/^\s+|\s+$/g, '');
var rows = parseInt(rowsText, 10);
var cols = parseInt(colsText, 10);
var gutterValue = parseFloat(inputGutter.text);
var marginValue = parseFloat(inputMargin.text);
var artboardMarginValue = parseFloat(inputArtMargin.text);
var numOffsetValue = parseFloat(inputNumOffset.text);
var numSizeValue = parseFloat(inputNumSize.text);
var numberPattern = /^\s*\+?(?:\d+(?:\.\d*)?|\.\d+)\s*$/;
var errorMessage = null;
if (!/^\d+$/.test(rowsText) || rows < 1) errorMessage = "Rows must be a positive whole number.";
else if (!/^\d+$/.test(colsText) || cols < 1) errorMessage = "Cols must be a positive whole number.";
else if (rows * cols > 5000) errorMessage = "Grid capacity is limited to 5000 cells.";
else if (!numberPattern.test(inputGutter.text) || !isFinite(gutterValue) || gutterValue < 0) errorMessage = "Gutter must be a non-negative number.";
else if (!numberPattern.test(inputMargin.text) || !isFinite(marginValue) || marginValue < 0) errorMessage = "Cell inset must be a non-negative number.";
else if (!numberPattern.test(inputArtMargin.text) || !isFinite(artboardMarginValue) || artboardMarginValue < 0) errorMessage = "Artboard margin must be a non-negative number.";
else if (!numberPattern.test(inputNumOffset.text) || !isFinite(numOffsetValue) || numOffsetValue < 0) errorMessage = "Number offset must be a non-negative number.";
else if (!numberPattern.test(inputNumSize.text) || !isFinite(numSizeValue) || numSizeValue <= 0) errorMessage = "Number size must be greater than zero.";
var parsedHexA = hexToRgb(inputHexA.text);
var parsedHexB = hexToRgb(inputHexB.text);
if (!errorMessage && checkColor.value && parsedHexA === false) errorMessage = "Color A must be a 6-digit hex color, such as #336699.";
if (!errorMessage && checkColor.value && parsedHexB === false) errorMessage = "Color B must be a 6-digit hex color, such as #336699.";
if (errorMessage) {
    if (isFinal) alert("Invalid settings: " + errorMessage);
    return false;
}
var gutter = gutterValue * mmToPt;
var margin = marginValue * mmToPt;
var artboardMargin = artboardMarginValue * mmToPt;
var totalCells = rows * cols;
if (isFinal && totalObjects > totalCells) {
alert("Error: Total objects (" + totalObjects + ") exceeds grid capacity (" + totalCells + ")!");
return false;
}
var netW = abW - (artboardMargin * 2);
var netH = abH - (artboardMargin * 2);
if (netW <= 0 || netH <= 0) {
    if (isFinal) alert("Artboard margin is larger than the available artboard area.");
    return false;
}
var cellW = (netW - ((cols - 1) * gutter)) / cols;
var cellH = (netH - ((rows - 1) * gutter)) / rows;
if (cellW <= 0 || cellH <= 0) {
    if (isFinal) alert("The gutter is too large for the selected grid and artboard.");
    return false;
}
if (cellW <= (margin * 2) || cellH <= (margin * 2)) {
    if (isFinal) alert("Cell inset is too large for the available cell size.");
    return false;
}
var startX = abRect[0] + artboardMargin;
var startY = abRect[1] - artboardMargin;
var outGroup = targetDoc.groupItems.add();
outGroup.name = isFinal ? "GRID_DISTRIBUTION_FINAL" : "GRID_DISTRIBUTION_PREVIEW";
try {
var bgGroup = outGroup.groupItems.add();
bgGroup.name = "ALL_BACKGROUND_CELLS";
var numbersGroup = null;
if (checkAddNumbers.value) {
numbersGroup = outGroup.groupItems.add();
numbersGroup.name = "ALL_CELL_NUMBERS";
}
var useChaserColor = checkColor.value;
var useAutoContrast = checkAutoContrast.value && checkAutoContrast.enabled;
var shouldAddNumbers = checkAddNumbers.value;
var numPosSelected = dropNumPos.selection.text;
var numOffsetPt = numOffsetValue * mmToPt;
var userNumSize = numSizeValue;
var hexAColor = parsedHexA;
var cA = hexAColor ? hexAColor : getColorObject(dropColorA.selection.text);
var isADark = hexAColor ? isColorObjDark(hexAColor) : isDarkColorName(dropColorA.selection.text);
var hexBColor = parsedHexB;
var cB = hexBColor ? hexBColor : getColorObject(dropColorB.selection.text);
var isBDark = hexBColor ? isColorObjDark(hexBColor) : isDarkColorName(dropColorB.selection.text);
var pureWhite = new RGBColor(); pureWhite.red = 255; pureWhite.green = 255; pureWhite.blue = 255;
var pureBlack = new RGBColor(); pureBlack.red = 0; pureBlack.green = 0; pureBlack.blue = 0;
var objIndex = 0;
for (var r = 0; r < rows; r++) {
for (var c = 0; c < cols; c++) {
var x = startX + (c * (cellW + gutter));
var y = startY - (r * (cellH + gutter));
var cellRect = bgGroup.pathItems.rectangle(y, x, cellW, cellH);
var logoColorTarget = pureBlack;
var currentBgIsDark = false;
if (useChaserColor) {
cellRect.filled = true;
if ((r + c) % 2 === 0) {
cellRect.fillColor = cA;
currentBgIsDark = isADark;
if (useAutoContrast) {
logoColorTarget = radioInvert.value ? cB : (isADark ? pureWhite : pureBlack);
}
} else {
cellRect.fillColor = cB;
currentBgIsDark = isBDark;
if (useAutoContrast) {
logoColorTarget = radioInvert.value ? cA : (isBDark ? pureWhite : pureBlack);
}
}
} else {
cellRect.filled = false;
}
if (!isFinal) {
cellRect.stroked = true;
var guideColor = new RGBColor();
guideColor.red = 0; guideColor.green = 180; guideColor.blue = 255;
cellRect.strokeColor = guideColor;
cellRect.strokeWidth = 1;
} else {
cellRect.stroked = false;
}
var cellIndexNumber = (r * cols) + c + 1;
if (shouldAddNumbers && cellIndexNumber <= totalObjects && numbersGroup != null) {
var numText = numbersGroup.textFrames.add();
numText.contents = String(cellIndexNumber);
numText.textRange.characterAttributes.size = userNumSize;
if (useChaserColor) {
numText.textRange.characterAttributes.fillColor = useAutoContrast ? logoColorTarget : (currentBgIsDark ? pureWhite : pureBlack);
} else {
numText.textRange.characterAttributes.fillColor = pureBlack;
}
if (numPosSelected === "Top Left") {
numText.left = x + numOffsetPt;
numText.top = y - numOffsetPt;
} else if (numPosSelected === "Top Right") {
numText.left = (x + cellW) - numText.width - numOffsetPt;
numText.top = y - numOffsetPt;
} else if (numPosSelected === "Bottom Left") {
numText.left = x + numOffsetPt;
numText.top = (y - cellH) + numText.height + numOffsetPt;
} else if (numPosSelected === "Bottom Right") {
numText.left = (x + cellW) - numText.width - numOffsetPt;
numText.top = (y - cellH) + numText.height + numOffsetPt;
}
}
if (objIndex < totalObjects) {
var copiedObj = workingObjects[objIndex].duplicate(outGroup, ElementPlacement.PLACEATBEGINNING);
copiedObj.hidden = false;
scaleAndCenterObject(copiedObj, cellW, cellH, x, y, margin);
if (useChaserColor && useAutoContrast) {
RecolorToFlat(copiedObj, logoColorTarget);
}
objIndex++;
}
}
}
return outGroup;
} catch (buildError) {
    try { outGroup.remove(); } catch (cleanupError) {}
    if (isFinal) alert("Could not build the grid: " + buildError.message);
    return false;
}
}
function scaleAndCenterObject(obj, cellW, cellH, x, y, margin) {
var maxW = cellW - (margin * 2);
var maxH = cellH - (margin * 2);
if (obj.width <= 0 || obj.height <= 0) throw new Error("A selected object has zero width or height and cannot be scaled.");
if (maxW > 0 && maxH > 0) {
var ratioW = maxW / obj.width;
var ratioH = maxH / obj.height;
var scaleRatio = Math.min(ratioW, ratioH);
obj.width = obj.width * scaleRatio;
obj.height = obj.height * scaleRatio;
}
var cellCenterX = x + (cellW / 2);
var cellCenterY = y - (cellH / 2);
obj.left = cellCenterX - (obj.width / 2);
obj.top = cellCenterY + (obj.height / 2);
}
// --- INTERACTIVE PREVIEW EVENTS ---
function updatePreview() {
if (checkColor.value) {
checkAutoContrast.enabled = true;
contrastModeGroup.enabled = checkAutoContrast.value;
colAGroup.enabled = true;
colBGroup.enabled = true;
} else {
checkAutoContrast.enabled = false;
checkAutoContrast.value = false;
contrastModeGroup.enabled = false;
colAGroup.enabled = false;
colBGroup.enabled = false;
}
numSettingsGroup.enabled = checkAddNumbers.value;
if (previewGroup != null) {
try { previewGroup.remove(); } catch(e) {}
previewGroup = null;
}
if (checkPreview.value) {
previewGroup = executeGridLogic(mainDoc, false);
if (previewGroup) {
    for (var i = 0; i < workingObjects.length; i++) workingObjects[i].hidden = true;
} else {
    for (var i = 0; i < workingObjects.length; i++) workingObjects[i].hidden = false;
}
app.redraw();
} else {
for (var i = 0; i < workingObjects.length; i++) {
    workingObjects[i].hidden = false;
}
app.redraw();
}
}
dropColorA.onChange = updatePreview;
dropColorB.onChange = updatePreview;
inputHexA.onChanging = updatePreview;
inputHexB.onChanging = updatePreview;
dropNumPos.onChange = updatePreview;
inputNumOffset.onChanging = updatePreview;
inputNumSize.onChanging = updatePreview;
function setupArrowKeySupport(edittextObj) {
edittextObj.addEventListener("keydown", function(event) {
var step = event.shiftKey ? 10 : 1;
var val = parseFloat(edittextObj.text) || 0;
if (event.keyName == "Up") {
edittextObj.text = String(val + step);
event.preventDefault();
updatePreview();
edittextObj.active = true;
} else if (event.keyName == "Down") {
var newVal = val - step;
if (newVal < 0) newVal = 0;
edittextObj.text = String(newVal);
event.preventDefault();
updatePreview();
edittextObj.active = true;
}
});
}
setupArrowKeySupport(inputRows); setupArrowKeySupport(inputCols);
setupArrowKeySupport(inputGutter); setupArrowKeySupport(inputMargin);
setupArrowKeySupport(inputArtMargin);
setupArrowKeySupport(inputNumOffset); setupArrowKeySupport(inputNumSize);
inputRows.onChanging = updatePreview; inputCols.onChanging = updatePreview;
inputGutter.onChanging = updatePreview; inputMargin.onChanging = updatePreview;
inputArtMargin.onChanging = updatePreview;
checkColor.onClick = updatePreview;
checkAutoContrast.onClick = updatePreview;
radioInvert.onClick = updatePreview;
radioBW.onClick = updatePreview;
checkPreview.onClick = updatePreview;
checkAddNumbers.onClick = updatePreview;
dialog.onShow = function() {
updatePreview();
};
dialog.layout.layout(true);
// --- EXECUTION ---
if (dialog.show() === 1) {
if (previewGroup != null) {
try { previewGroup.remove(); } catch(e) {}
previewGroup = null;
}
for (var i = 0; i < workingObjects.length; i++) {
workingObjects[i].hidden = false;
}
var finalGroup = executeGridLogic(mainDoc, true);
if (finalGroup) {
for (var i = 0; i < workingObjects.length; i++) {
try { workingObjects[i].remove(); } catch(e) {}
}
}
} else {
if (previewGroup != null) {
try { previewGroup.remove(); } catch(e) {}
}
for (var i = 0; i < workingObjects.length; i++) {
workingObjects[i].hidden = false;
}
}
app.redraw();
}
main();
