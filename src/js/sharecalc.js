var SHARE_FIELD_TABLE = [
    ["input:radio[name='defaultLevel']", "find"],
    ["input:checkbox[name='terrain']", "find"],
    ["input:radio[name='format']", "find"],
	["#beads","checked"],
	["#tablets","checked"],
	["#sword","checked"],
	["#vessel","checked"],
	["#magicroom","checked"],
	["#wonderroom","checked"],
	["#gravity","checked"],
	["#srL","checked"], ["#srR","checked"],
	["#steelsurgeL","checked"], ["#steelsurgeR","checked"],
	["#vinelashL","checked"], ["#vinelashR","checked"],
	["#wildfireL","checked"], ["#wildfireR","checked"],
	["#cannonadeL","checked"], ["#cannonadeR","checked"],
	["#volcalithL","checked"], ["#volcalithR","checked"],
	["#reflectL","checked"], ["#reflectR","checked"],
	["#lightScreenL","checked"], ["#lightScreenR","checked"],
	["#protectL","checked"], ["#protectR","checked"],
	["#leechSeedL","checked"], ["#leechSeedR","checked"],
	["#foresightL","checked"], ["#foresightR","checked"],
	["#helpingHandL","checked"], ["#helpingHandR","checked"],
	["#tailwindL","checked"], ["#tailwindR","checked"],
	["#flowerGiftL","checked"], ["#flowerGiftR","checked"],
	["#friendGuardL","checked"], ["#friendGuardR","checked"],
	["#auroraVeilL","checked"], ["#auroraVeilR","checked"],
	["#batteryL","checked"], ["#batteryR","checked"],
	["#powerSpotL","checked"], ["#powerSpotR","checked"],
	["#switchingL","checked"], ["#switchingR","checked"],
    ["#critL1", "checked"], ["#critR1", "checked"],
    ["#critL2", "checked"], ["#critR2", "checked"],
    ["#critL3", "checked"], ["#critR3", "checked"],
    ["#critL4", "checked"], ["#critR4", "checked"],
    ["#zL1", "checked"], ["#zR1", "checked"],
    ["#zL2", "checked"], ["#zR2", "checked"],
    ["#zL3", "checked"], ["#zR3", "checked"],
    ["#zL4", "checked"], ["#zR4", "checked"],
]
// GS => Generation Specific
var SHARE_GS_FIELD_TABLE = [

]
var SHARE_PANNEL_TABLE = [
    [".forme","indexid", "pokedex"],
    [".gender","keyid", "genders"],
    [".current-hp","val"],
    [".percent-hp","val", "100"],
    [".status","indexid", "CALC_STATUS"],
    [".at .boost","val", "0"],
    [".df .boost","val", "0"],
    [".sp .boost","val", "0"],
    [".saltcure","checked"],
    [".max","checked"],
]
var SHARE_GS_PANNEL_TABLE = [

]
var SHARE_SET_TABLE = [
    [".level","val", "100"],
    [".teraType","indexid", "typeChart"],
    [".nature","keyidTI", "NATURES_BY_ID"],
    [".item","index", "items"],
    [".ability","index", "abilities"],
    [".move1 .select2-offscreen.move-selector","indexid", "moves"], 
    [".move2 .select2-offscreen.move-selector","indexid", "moves"], 
    [".move3 .select2-offscreen.move-selector","indexid", "moves"], 
    [".move4 .select2-offscreen.move-selector","indexid", "moves"], 
    //evs   // in function of generation
    //ivs   // --
    //dvs   // --
]   
var SHARE_GS_SET_TABLE = [

]

var genders = ["Male", "Female", ""]
// this was made in an effort to reduce the length of URL
// However questionnable if the complexity it adds is worth. 
function adaptFieldsToGen(){
    if (gen == 1) {
        SHARE_GS_SET_TABLE = [
            [".sl .dvs","val","15"],
        ];
        SHARE_GS_FIELD_TABLE = [
            [".sl .boost","val","0"],
        ];
	} else {
        SHARE_GS_FIELD_TABLE = [
            [".sa .boost","val","0"],
            [".sd .boost","val","0"],
        ];
    }
    if (gen == 2) {
        SHARE_GS_SET_TABLE = [
            [".sa .dvs","val","15"],
            [".sd .dvs","val","15"],
        ];
        SHARE_GS_FIELD_TABLE = [
            ["#gscSpikesL", "checked"],
            ["#gscSpikesR", "checked"],
            ["input:radio[name='gscWeather']", "find"],
        ];
	}
    if (gen < 3){
        SHARE_GS_SET_TABLE = [
            [".hp .dvs","val","15"],
            [".at .dvs","val","15"],
            [".df .dvs","val","15"],
            [".sp .dvs","val","15"],
        ];
        
    } else {
        SHARE_GS_FIELD_TABLE = [
            ["input:radio[name='spikesL']:checked", "val", "0"], 
            ["input:radio[name='spikesR']:checked", "val", "0"],
            ["input:radio[name='weather']", "find"],
        ];
        SHARE_GS_SET_TABLE = [
            [".hp .ivs","val","31"],
            [".hp .evs","val","0"],
            [".at .ivs","val","31"],
            [".at .evs","val","0"],
            [".df .ivs","val","31"],
            [".df .evs","val","0"],
            [".sa .ivs","val","31"],
            [".sa .evs","val","0"],
            [".sd .ivs","val","31"],
            [".sd .evs","val","0"],
            [".sp .ivs","val","31"],
            [".sp .evs","val","0"],
        ];
    }
}

function exportCalculation(){
    adaptFieldsToGen()
    var findChecked = function(query){
        var fullQuery = $(query).toArray()
        for (var i = 0, iLen = fullQuery.length; i < iLen; i++){
            if (fullQuery[i].checked){
                return i
            }
        }
        return ""
    }
    // the second layer of compaction
    // addLoc => additionnal locator, to adapt to pannels
    var tableCompaction = function(table, addLoc){
        addLoc = addLoc || ""
        var fieldComposition = ""
        for (var i = 0, iLen = table.length; i < iLen; i++){
            var field = table[i];
            var locator = $(addLoc + field[0]);
            var extractor = field[1];
            var data = ""
            if (extractor === "checked") {
                data = +locator.prop("checked")
                if (data == 0){
                    data = ""
                }
            } else if (extractor === "val"){
                data = locator.val();
                var defaultVal = field[2]
                if (data == defaultVal){
                    data = ""
                }
            } else if (extractor === "find"){
                data = findChecked(locator) 
            } else if (extractor === "index"){
                var obj = window[field[2]]
                data = obj.indexOf(locator.val())
            } else if (extractor === "keyidTI"){
                var obj = window[field[2]]
                var value = toID(locator.val())
                data = Object.keys(obj).indexOf(value)
            } else if (extractor === "keyid"){
                var obj = window[field[2]]
                data = obj.indexOf(locator.val())
            } else if (extractor === "indexid"){
                var obj = window[field[2]]
                data = Object.keys(obj).indexOf(locator.val())
            } else if (extractor === "text"){
                data = locator.text()
            }
            if (!data) {
                data = ""
            }
            fieldComposition += data + ":";
        }
        return fieldComposition
    }
    fieldComposition = "";
    fieldComposition += Object.keys(pokedex).indexOf(
        $('#p1 .set-selector.select2-offscreen').val().replace(/ \(.*/, ""))
        + ":";
    fieldComposition += Object.keys(pokedex).indexOf(
        $('#p2 .set-selector.select2-offscreen').val().replace(/ \(.*/, ""))
        + ":";
    fieldComposition += tableCompaction(
        SHARE_SET_TABLE.concat(SHARE_GS_SET_TABLE), "#p1 ");
    fieldComposition += tableCompaction(
        SHARE_SET_TABLE.concat(SHARE_GS_SET_TABLE), "#p2 ");
    fieldComposition += tableCompaction(
        SHARE_PANNEL_TABLE.concat(SHARE_GS_PANNEL_TABLE), "#p1 ");
    fieldComposition += tableCompaction(
        SHARE_PANNEL_TABLE.concat(SHARE_GS_PANNEL_TABLE), "#p2 ");
    fieldComposition += tableCompaction(
        SHARE_FIELD_TABLE.concat(SHARE_GS_FIELD_TABLE));
    // trim the last separator
    fieldComposition = fieldComposition.replace(/\:$/,"");
    //1:1::11:8:22:-1:28:243:94:30:::11:13:12:::11:8:22:-1:28:243:94:30:::11:13:12::-1:1:::::::355::-1::::::::355::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    
    //return fieldComposition
    /* further compaction alg
        if there is 3 or more default values in a row
        (care to make the tables in a way that all default value sensitive
        row are aligned, so its optimise evenmore)
        if the field encounters ;, it will interprets the integer following
        as the number of default value in a row.
        so the uncompacter will expand it intuitively.
    */
    var data = fieldComposition.split(":");
    var compactedFieldComposition = "";
    var skip = 0
    // effectively the first layer of compaction
    // which trims 50% of the data
    var writeSkipped = function(data, skip){
        if (skip == 1){
            // means "::"
            data = data.slice(0,-1) + "!";
        } else if (skip == 2) {
            // means ":::"
            data = data.slice(0,-1) + "~";
        } else if (skip == 3){
            // means ":::"
            data = data.slice(0,-1) + "_";
        }    
        else if (skip >3) {
            data = data.slice(0,-1);
            data += ";" + skip + ":";
        }
        return data;
    }
    for (var i = 0, iLen = data.length; i < iLen; i++){
        var row = data[i]
        if (row === ""){
            skip++;
            continue;
        }
        compactedFieldComposition = writeSkipped(compactedFieldComposition, skip);
        
        skip = 0
        compactedFieldComposition += row + ":";
    }
    if (skip > 0){
        compactedFieldComposition = writeSkipped(compactedFieldComposition, skip);
    }
    // trim the last separator
    compactedFieldComposition = compactedFieldComposition.replace(/\:$/,"");
    //file:///media/notalinux/_dev_sdb3/Programation/web/damage-calc/dist/index.html?gen=2&share=1:1::11:::8:::22:::-1:::28:::243:::94:::30:;3:11:;3:13:;3:12:;5:11:;5:8:;5:22:;5:-1:;5:28:;5:243:;5:94:;5:30:;7:11:;7:13:;7:12:;8:-1:;8:1:;14:355:;15:-1:;22:355:;23:_:;23:_:;23:_:;88:_:
    //file:///media/notalinux/_dev_sdb3/Programation/web/damage-calc/dist/index.html?gen=2&share=1:1::11:8:22:-1:28:243:94:30:::11:13:12:::11:8:22:-1:28:243:94:30:::11:13:12::-1:1:::::::355::-1::::::::355::_:_:_::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::_
    return "&share=" + compactedFieldComposition;
}

function importCalculation(compactedData){
    /*
        uncompact the first layer of compactions
    */
    compactedData = compactedData.replaceAll("!", "::")
    compactedData = compactedData.replaceAll("~", ":::")
    compactedData = compactedData.replaceAll("_", "::::")
    compactedData = compactedData.split(";");
    var data = compactedData[0]
    for (var i = 1; i < compactedData.length; i++){
        var row = compactedData[i];
        var skip = row.match(/^[^:]+/)[0];
        row = row.slice(skip.length)
        row = ":".repeat(+skip) + row
        data += row
    }
    data = data.split(":")
    adaptFieldsToGen()
    // function to uncompact the second layer
    var tableUncompaction = function(table, addLoc){
        for (var i = 0, iLen = table.length; i < iLen; i++){
            addLoc = addLoc || "";
            var field = table[i];
            var locator = $(addLoc + field[0]);
            var extractor = field[1];
            var field_data = data.splice(0,1)[0]
            if (extractor === "checked") {
                if (+field_data){
                    locator.prop("checked", true);
                } else {
                    locator.prop("checked", false);
                }
            } else if (extractor === "val"){
                var defaultVal = field[2];
                if (field_data){
                    locator.val(field_data);
                } else {
                    locator.val(defaultVal);
                }
            } else if (extractor === "find"){
                if (field_data !== ""){
                    locator.eq(field_data).prop("checked", true)
                }
            } else if (extractor === "index"){
                if (field_data){
                    var obj = window[field[2]]
                    locator.val(obj[field_data])
                }
            } else if (extractor === "keyidTI"){
                if (field_data){
                    var obj = window[field[2]]
                    field_data = obj[Object.keys(obj)[field_data]].name
                    locator.val(field_data)
                }
            } else if (extractor === "keyid"){
                var obj = window[field[2]]
                field_data = obj[Object.keys(obj)[field_data]]
                locator.val(field_data)
            } else if (extractor === "indexid"){
                var obj = window[field[2]]
                field_data = Object.keys(obj)[field_data]
                locator.val(field_data)
            } else if (extractor === "text"){
                locator.text(field_data)
            }
        }
    }
    var pokeL = Object.keys(pokedex)[data.splice(0,1)[0]];
    var pokeR = Object.keys(pokedex)[data.splice(0,1)[0]];
    pokeL = pokeL + " (Shared Set L)";
    pokeR = pokeR + " (Shared Set R)";
    $('#p1 input.set-selector').val(pokeL);
    $('#p2 input.set-selector').val(pokeR);
    tableUncompaction(
        SHARE_SET_TABLE.concat(SHARE_GS_SET_TABLE), "#p1 ");
    tableUncompaction(
        SHARE_SET_TABLE.concat(SHARE_GS_SET_TABLE), "#p2 ");

    // by doing all of this, i don't overwrite any existing set
    // with a newly created set it's overall easier to interact with
    ExportPokemon($('#p1'))
    document.getElementsByClassName("import-name-text")[0].value = "Shared Set L"
    $("#import.bs-btn").click();
    ExportPokemon($('#p2'))
    document.getElementsByClassName("import-name-text")[0].value = "Shared Set R"
    $("#import.bs-btn").click();
    $('#p1 input.set-selector').val(pokeL);
    $('#p2 input.set-selector').val(pokeR);
    // then actualizing it set all default value to initial
    $('input.set-selector').change()
    $('#p1 .set-selector .select2-chosen').text(pokeL);
    $('#p2 .set-selector .select2-chosen').text(pokeR);
    // just replace all the field by the once shared.
    tableUncompaction(
        SHARE_PANNEL_TABLE.concat(SHARE_GS_PANNEL_TABLE), "#p1 ");
    tableUncompaction(
        SHARE_PANNEL_TABLE.concat(SHARE_GS_PANNEL_TABLE), "#p2 ");
    tableUncompaction(
        SHARE_FIELD_TABLE.concat(SHARE_GS_FIELD_TABLE));

    //for some reason i had to clean this
    document.getElementsByClassName("import-team-text")[0].value = "";
	document.getElementsByClassName("import-name-text")[0].value = "Custom Set";
}

$(document).ready(function(){
    $('#share-calc').click(function(){
        var baseLink = (window.location+"").replace(/(?<=html).*/, "");
        var gen = "?gen=" + $("input:radio[name='gen']:checked").val();
        var data = exportCalculation();
        navigator.clipboard.writeText(baseLink+gen+data).then(function () {
            $('#share-calc').text("Copied to clipboard")
            setTimeout(function(){
                $('#share-calc').text("Share Calculation")
            }, 2500)
        });
    })
    var params = new URLSearchParams(window.location.search);
    var data = params.get('share')
    if (data){
        importCalculation(data)
        params.delete('share');
    }

})

