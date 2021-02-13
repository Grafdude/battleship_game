function shipPosition() {
    let arr = ["A", "B", "C", "D", "E", "F", "G"];
    let ranLetter = Math.floor(Math.random() * (arr.length));
    let ranNum = Math.floor(Math.random() * (arr.length));

    let pos1 = arr[ranLetter] + ranNum;
    let pos2;
    if (ranNum < 6) {
        pos2 = ranNum + 1;
    } else {
        pos2 = ranNum - 1;
    }

    return pos1 + pos2;
}