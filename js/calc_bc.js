$.fn.DataTable.ColVis.prototype._fnDomColumnButton = function(i) {
    var
        that = this,
        column = this.s.dt.aoColumns[i],
        dt = this.s.dt;
    
    var title = this.s.fnLabel === null ?
        column.sTitle :
        this.s.fnLabel(i, column.sTitle, column.nTh);
    
    return $(
            '<li ' + (dt.bJUI ? 'class="ui-button ui-state-default"' : '') + '>' +
            '<label>' +
            '<input type="checkbox" />' +
            '<span>' + title + '</span>' +
            '</label>' +
            '</li>'
        )
        .click(function(e) {
            var showHide = !$('input', this).is(":checked");
            if (e.target.nodeName.toLowerCase() !== "li") {
                showHide = !showHide;
            }
            
            /* Need to consider the case where the initialiser created more than one table - change the
             * API index that DataTables is using
             */
            var oldIndex = $.fn.dataTableExt.iApiIndex;
            $.fn.dataTableExt.iApiIndex = that._fnDataTablesApiIndex.call(that);
            
            // Optimisation for server-side processing when scrolling - don't do a full redraw
            if (dt.oFeatures.bServerSide) {
                that.s.dt.oInstance.fnSetColumnVis(i, showHide, false);
                that.s.dt.oInstance.fnAdjustColumnSizing(false);
                if (dt.oScroll.sX !== "" || dt.oScroll.sY !== "") {
                    that.s.dt.oInstance.oApi._fnScrollDraw(that.s.dt);
                }
                that._fnDrawCallback();
            } else {
                that.s.dt.oInstance.fnSetColumnVis(i, showHide);
            }
            
            $.fn.dataTableExt.iApiIndex = oldIndex; /* Restore */
            
            if ( (e.target.nodeName.toLowerCase() === 'input' || e.target.nodeName.toLowerCase() === 'li') && that.s.fnStateChange !== null ) {
                that.s.fnStateChange.call(that, i, showHide);
            }
        })[0];
};

$.fn.dataTableExt.oSort['damage-pre'] = parseFloat;

function calculate() {
    var attacker, defender, setName, setTier;
    var selectedTiers = getSelectedTiers();
    var setOptions = getSetOptions();
    var dataSet = [];
    for (var i = 0; i < setOptions.length; i++) {
        if (setOptions[i].id && typeof setOptions[i].id !== "undefined") {
            setName = setOptions[i].id.substring(setOptions[i].id.indexOf("(") + 1, setOptions[i].id.lastIndexOf(")"));
            setTier = setName.substring(0, setName.indexOf(" "));
            if (_.contains(selectedTiers, setTier)) {
                attacker = (mode === "one-vs-all") ? new Pokemon($("#p1")) : new Pokemon(setOptions[i].id);
                defender = (mode === "one-vs-all") ? new Pokemon(setOptions[i].id) : new Pokemon($("#p1"));
                var field = new Field();
                var damageResults = calculateMovesOfAttacker(attacker, defender, field);
                var result, minDamage, maxDamage, minPercent, maxPercent; 
                var defenderSide = field.getSide( ~~(mode === "one-vs-all") );
                var highestMaxPercent = -1;
                var data = [
                    setOptions[i].id,
                    (mode === "one-vs-all") ? defender.type1 : attacker.type1,
                    (mode === "one-vs-all") ? defender.type2 : attacker.type2,
                    (mode === "one-vs-all") ? defender.ability : attacker.ability,
                    (mode === "one-vs-all") ? defender.item : attacker.item
                ];
                for (var n = 0; n < 4; n++) {
                    result = damageResults[n];
                    minDamage = result.damage[0] * attacker.moves[n].hits;
                    maxDamage = result.damage[result.damage.length-1] * attacker.moves[n].hits;
                    minPercent = Math.floor(minDamage * 1000 / defender.maxHP) / 10;
                    maxPercent = Math.floor(maxDamage * 1000 / defender.maxHP) / 10;
                    result.koChanceText = attacker.moves[n].bp === 0 ? 'nice move'
                            : getKOChanceText(result.damage, defender, defenderSide, attacker.moves[n].hits, attacker.ability === 'Bad Dreams');
                    if (maxPercent > highestMaxPercent) {
                        highestMaxPercent = maxPercent;
                        while (data.length > 5) { data.pop(); }
                        data.push( attacker.moves[n].name.replace("Hidden Power", "HP") );
                        data.push( minPercent + " - " + maxPercent + "%" );
                        data.push( result.koChanceText );
                    } else if (maxPercent === highestMaxPercent) {
                        data[5] += (attacker.moves[n].name === "(No Move)") ? "" : " & " + attacker.moves[n].name.replace("Hidden Power", "HP");
                    }
                }
                dataSet.push(data);
            }
        }
    }
    
    table.clear();
    table.rows.add(dataSet).draw();
}

function getSelectedTiers() {
    var selectedTiers = $('.tiers input:checked').map(function () { 
        return this.id; 
    }).get();
    return selectedTiers;
}

var calculateMovesOfAttacker;
$(".gen").change(function () {
    $(".tiers input").prop("checked", false);
    $("#singles-format").attr("disabled", false);
    switch(gen) {
        case 1:
            calculateMovesOfAttacker = CALCULATE_MOVES_OF_ATTACKER_RBY;
            break;
        case 2:
            calculateMovesOfAttacker = CALCULATE_MOVES_OF_ATTACKER_GSC;
            break;
        case 3:
            calculateMovesOfAttacker = CALCULATE_MOVES_OF_ATTACKER_ADV;
            break;
        case 4:
            calculateMovesOfAttacker = CALCULATE_MOVES_OF_ATTACKER_DPP;
            break;
        default:
            calculateMovesOfAttacker = CALCULATE_MOVES_OF_ATTACKER_BW;
            break;
    }
    adjustTierBorderRadius();
    
    if ( $.fn.DataTable.isDataTable("#holder-2")  ) {
        table.clear();
        constructDataTable();
        
        var honkalculator = "<button style='position:absolute' class='bs-btn bs-btn-default'>Honkalculate</button>";
        $("#holder-2_wrapper").prepend(honkalculator);
        
        var dtHeadTop = $(".sorting").offset().top;
        var dtWrapperToHead = dtHeadTop - $("#holder-2_wrapper").offset().top;
        var fieldsetToDTHead = dtHeadTop - ( $(".holder-0").offset().top + $(".holder-0 .panel-title").outerHeight()/2 );
        var buttonOffset = (dtWrapperToHead - fieldsetToDTHead / 2) - $(".bs-btn").outerHeight()/2;
        $(".bs-btn").css({ "top": buttonOffset });
        $(".bs-btn").click(function() { 
            calculate();
        });
    }
});

function adjustTierBorderRadius() {
    var squaredLeftCorner = { "border-top-left-radius": 0, "border-bottom-left-radius": 0 };
    var roundedLeftCorner = { "border-top-left-radius": "8px", "border-bottom-left-radius": "8px" };
    if (gen <= 2) {
        $("#UU").next("label").css(roundedLeftCorner);
    } else {
            $("#UU").next("label").css(squaredLeftCorner);
            $("#NU").next("label").css(roundedLeftCorner);
            
            if (gen > 3) {
                $("#NU").next("label").css(squaredLeftCorner);
                $("#LC").next("label").css(roundedLeftCorner);
                
                if (gen > 4) {
                    $("#LC").next("label").css(squaredLeftCorner);
                    $("#Doubles").next("label").css(roundedLeftCorner);
                    
                    if (gen > 5) {
                        $("#Doubles").next("label").css(squaredLeftCorner);
                    }
                }
            }
    }
}

$(".mode").change(function() {
    if ( $("#one-vs-one").prop("checked") ) {
        window.location.replace( "index.html" );
  } else {
        window.location.replace( "calc_bc.html?mode=" + $(this).attr("id") );
  }
});

$(".tiers label").mouseup(function() {
    var oldID = $('.tiers input:checked').attr("id");
    var newID = $(this).attr("for");
    if ((oldID === "Doubles" || oldID === "VGC14") && (newID !== oldID)) { 
        $("#singles-format").attr("disabled", false);
        $("#singles-format").prop("checked", true);
    }
    if ((oldID === "VGC14" || oldID === "LC") && (newID !== "VGC14" && newID !== "LC")) {
        $('.level').val("100");
        $('.level').keyup();
        $('.level').popover({
            content: "Level has been reset to 100",
            placement: "right"
        }).popover('show');
        setTimeout(function(){ $('.level').popover('destroy') }, 3000);
    }
});

$(".tiers input").change(function() {
    var type = $(this).attr("type");
    var id = $(this).attr("id");
    $(".tiers input").not(":" + type).prop("checked", false); // deselect all radios if a checkbox is checked, and vice-versa
    
    if (gen === 1 && $("#OU").prop("checked")) {
        $("#UU").prop("checked", true);
    }
    
    if (id === "Doubles" || id === "VGC14") {
        $("#doubles-format").prop("checked", true);
        $("#singles-format").attr("disabled", true);
    }
    
    if (id === "LC" && $('.level').val() !== "5") {
        $('.level').val("5");
        $('.level').keyup();
        $('.level').popover({
            content: "Level has been set to 5",
            placement: "right"
        }).popover('show');
        setTimeout(function(){ $('.level').popover('destroy') }, 1350);
    }
    
    if (id === "VGC14" && $('.level').val() !== "50") {
        $('.level').val("50");
        $('.level').keyup();
        $('.level').popover({
            content: "Level has been set to 50",
            placement: "right"
        }).popover('show');
        setTimeout(function(){ $('.level').popover('destroy') }, 1350);
    }
});

$(".set-selector").change(function() {
    var selectedTier = getSelectedTiers()[0];
    if (selectedTier === "LC" && $('.level').val() !== "5") {
        $('.level').val("5");
        $('.level').keyup();
        $('.level').popover({
            content: "Level has been set to 5",
            placement: "right"
        }).popover('show');
        setTimeout(function(){ $('.level').popover('destroy') }, 1350);
    }
    
    if (selectedTier === "VGC14" && $('.level').val() !== "50") {
        $('.level').val("50");
        $('.level').keyup();
        $('.level').popover({
            content: "Level has been set to 50",
            placement: "right"
        }).popover('show');
        setTimeout(function(){ $('.level').popover('destroy') }, 1350);
    }
});

var table;
function constructDataTable() {
    var dtWidth = $(window).width() - $("#holder-2").offset().left;
    dtWidth -= 2 * parseFloat($(".holder-0").css("padding-right"));
    table = $("#holder-2").DataTable( {
        destroy: true,
        columnDefs: [
            {
                targets: (gen > 2) ? [] : (gen === 2) ? [3] : [3, 4],
                visible: false,
                searchable: false
            },
            {
                targets: [6],
                type: 'damage'
            }
        ],
        dom: 'C<"clear">frtiS',
        colVis: {
            exclude: (gen > 2) ? [0, 5, 6] : (gen === 2) ? [0, 3, 5, 6] : [0, 3, 4, 5, 6],
            stateChange: function(iColumn, bVisible) {
                var column = table.settings()[0].aoColumns[iColumn];
                if (column.bSearchable !== bVisible) {
                    column.bSearchable = bVisible;
                    table.rows().invalidate();
                }
            }
        },
        scrollX: dtWidth,
        scrollY: dtHeight,
        scrollCollapse: true
    } );
    $(".dataTables_wrapper").width(dtWidth);
}

function getBottomOffset(obj) {
    return obj.offset().top + obj.outerHeight();
}

var mode, dtHeight;
$(document).ready(function() {
    var url = window.location.href;
    mode = url.substring(url.indexOf('=') + 1, url.length);
    $("#" + mode).prop("checked", true);
    $("#holder-2 th:first").text( (mode === "one-vs-all") ? "Defender" : "Attacker" );
    $("#holder-2").show();
    
    setDTHeight();
    constructDataTable();
    
    var honkalculator = "<button style='position:absolute' class='bs-btn bs-btn-default'>Honkalculate</button>";
    $("#holder-2_wrapper").prepend(honkalculator);
    
    var dtHeadTop = $(".sorting").offset().top;
    var dtWrapperToHead = dtHeadTop - $("#holder-2_wrapper").offset().top;
    var fieldsetToDTHead = dtHeadTop - ( $(".holder-0").offset().top + $(".holder-0 .panel-title").outerHeight()/2 );
    var buttonOffset = (dtWrapperToHead - fieldsetToDTHead / 2) - $(".bs-btn").outerHeight()/2;
    $(".bs-btn").css({ "top": buttonOffset });
    $(".bs-btn").click(function() { 
        calculate();
    });
});

function setDTHeight() {
    $("#holder-2").DataTable( {
        dom: 'C<"clear">frti'
    });
    
    var theadBottomOffset = getBottomOffset($(".sorting"));
    var heightUnderDT = getBottomOffset($(".holder-0")) - getBottomOffset($("#holder-2 tbody"));
    dtHeight = $(document).height() - theadBottomOffset - heightUnderDT;
}
