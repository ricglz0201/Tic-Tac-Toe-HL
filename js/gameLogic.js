//Change score
var changeScore = function($oldScore){
    var score = $oldScore.text();
    score++;
    $oldScore.text(score);
};

function whereWasTheFirstMove($box){
    var contains = $.contains($bigBoxes.get(bigBoxPos), $box.get(0));
    while(!contains && bigBoxPos < 8){
        bigBoxPos++;
        contains = $.contains($bigBoxes.get(bigBoxPos), $box.get(0));
    }
};

//Apply movement
var apply = function($box){
    $box.text(turn);
    $box.addClass(turn);
    if(turn === 'O' && $('html').hasClass('ai') )fadeIn($box, 500);
    moves++;
    if(firstTurn){
        whereWasTheFirstMove($box);
    }
    amountOccupied[bigBoxPos]++;
    if(turn === "X") amountOccupied[bigBoxPos]+=2;
    board[bigBoxPos][$box.attr('id')] = turn;
    if(firstTurn){
        greyEverything();
    }
    firstTurn = false;
    var winner = getWinner();
    if(winner){
        alert("Player " + winner + " has won.");
        if(winner==="X"){
            changeScore($('.xScore').eq(0));
        } else{
            changeScore($('.oScore').eq(0));
        }
        resetGame();
    } else if (moves < 81){
        dontTouchBigBox[bigBoxPos] = areTwoInTheBox();
        changeColors($box);
        changeTurn();
        if(turn === "O" && $('html').hasClass('ai')){
            move();
        }
    } else{
        alert("Neither player won.");
        resetGame();
    }
};

//Check if it is Occupied
var isOccupied = function(text){
    return text === "X" || text === "O";
};

var areTwoValue = function(text){
    if(text === "X") return 90;
    return 40;
}

//Checks if there is two occupied box with the same value and a third which is not
var areTwo = function($firstBox, $secondBox, $thirdBox){
    var firstText = $firstBox.text(),
        secondText = $secondBox.text(),
        thirdText = $thirdBox.text();
    if((firstText === secondText) && isOccupied(firstText) && !isOccupied(thirdText)){
        return areTwoValue(firstText);
    }
    if(firstText === thirdText && isOccupied(firstText) && !isOccupied(secondText) ){
        return areTwoValue(firstText);
    }
    if(secondText === thirdText && isOccupied(secondText) && !isOccupied(firstText))
        return areTwoValue(secondText);
    return null;
};

//Check if there is almost a Diagnoal win
var areTwoInTheDiagonal = function(){
    var leftDiagonal = areTwo($boxes.eq(0 + bigBoxPos*9), $boxes.eq(4 + bigBoxPos*9), $boxes.eq(8 + bigBoxPos*9)),
        rightDiagonal = areTwo($boxes.eq(2 + bigBoxPos*9), $boxes.eq(4 + bigBoxPos*9), $boxes.eq(6 + bigBoxPos*9));
    return leftDiagonal + rightDiagonal;
};

//Check if there is almost a Column win
var areTwoInTheColumn = function(){
    var leftColumn = areTwo($boxes.eq(0 + bigBoxPos*9), $boxes.eq(1 + bigBoxPos*9), $boxes.eq(2 + bigBoxPos*9)),
        middleColumn = areTwo($boxes.eq(3 + bigBoxPos*9), $boxes.eq(4 + bigBoxPos*9), $boxes.eq(5 + bigBoxPos*9)),
        rightColumn = areTwo($boxes.eq(6 + bigBoxPos*9), $boxes.eq(7 + bigBoxPos*9), $boxes.eq(8 + bigBoxPos*9));
    return leftColumn + middleColumn + rightColumn;
};

//Check if there is almost a Row win
var areTwoInTheRow = function(){
    var upperRow = areTwo($boxes.eq(0 + bigBoxPos*9), $boxes.eq(3 + bigBoxPos*9), $boxes.eq(6 + bigBoxPos*9)),
        middleRow = areTwo($boxes.eq(1 + bigBoxPos*9), $boxes.eq(4 + bigBoxPos*9), $boxes.eq(7 + bigBoxPos*9)),
        bottomRow = areTwo($boxes.eq(2 + bigBoxPos*9), $boxes.eq(5 + bigBoxPos*9), $boxes.eq(8 + bigBoxPos*9));
    return upperRow + middleRow + bottomRow;
};

//Check if there is almost a Win for the X or for the O
var areTwoInTheBox = function(){
    return areTwoInTheColumn() + areTwoInTheDiagonal() + areTwoInTheRow();
};

function cleanContent (){
    for(var i = 0; i < board.length; i++){
        board[i] = ['', '', '', '', '', '', '', '', ''];
    }
};

//Reset the variable for a new game
var resetGame = function(){
    $boxes.text("");
    $boxes.removeClass("X");
    $boxes.removeClass("O");
    turn = 'X';
    moves = 0;
    firstTurn = true;
    bigBoxPos = 0;
    amountOccupied = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    dontTouchBigBox = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    whiteEverything();
    cleanContent();
};

//If is a multiplayer it allows to change the turn
var changeTurn = function(){
    if(turn === 'X'){
        turn = 'O';
    }else{
        turn = 'X';
    }
};

//Validate that three boxes has the same element and is not empty
var allThree = function($firstBox, $secondBox, $thirdBox){
    var firstText = $firstBox.text(),
        secondText = $secondBox.text(),
        thirdText = $thirdBox.text();
    if((firstText === secondText) && (secondText===thirdText)){
        if(firstText === "X" || firstText === "O") return firstText;
    }
    return null;
}

//Check if there is a Diagnoal win
var diagonalWin = function(){
    var leftDiagonal = allThree($boxes.eq(0 + bigBoxPos*9), $boxes.eq(4 + bigBoxPos*9), $boxes.eq(8 + bigBoxPos*9)),
        rightDiagonal = allThree($boxes.eq(2 + bigBoxPos*9), $boxes.eq(4 + bigBoxPos*9), $boxes.eq(6 + bigBoxPos*9));
    return leftDiagonal || rightDiagonal;
}

//Check if there is a Column win
var columnWin = function(){
    var leftColumn = allThree($boxes.eq(0 + bigBoxPos*9), $boxes.eq(1 + bigBoxPos*9), $boxes.eq(2 + bigBoxPos*9)),
        middleColumn = allThree($boxes.eq(3 + bigBoxPos*9), $boxes.eq(4 + bigBoxPos*9), $boxes.eq(5 + bigBoxPos*9)),
        rightColumn = allThree($boxes.eq(6 + bigBoxPos*9), $boxes.eq(7 + bigBoxPos*9), $boxes.eq(8 + bigBoxPos*9));
    return leftColumn || (middleColumn || rightColumn);
}

//Check if there is a Row win
var rownWin = function(){
    var upperRow = allThree($boxes.eq(0 + bigBoxPos*9), $boxes.eq(3 + bigBoxPos*9), $boxes.eq(6 + bigBoxPos*9)),
        middleRow = allThree($boxes.eq(1 + bigBoxPos*9), $boxes.eq(4 + bigBoxPos*9), $boxes.eq(7 + bigBoxPos*9)),
        bottomRow = allThree($boxes.eq(2 + bigBoxPos*9), $boxes.eq(5 + bigBoxPos*9), $boxes.eq(8 + bigBoxPos*9));
    return upperRow || (middleRow || bottomRow);
}

//Check if there is a winner
var getWinner = function(){
    return diagonalWin() || (rownWin() || columnWin());
}