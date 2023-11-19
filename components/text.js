function solution(N) {

    let result = [];

    let currentPostion = 97;

    while (N > 0) {
        if (N & 1) {

            result.push(String.fromCharCode(currentPostion));
        }

        N >>= 1;

        if (N > 0) currentPostion++;

        if (currentPostion == 25 && N > 0) {
            result = 'z'.repeat(N) + result;
            break;
        }
    }

    return result.reverse().join('');
}

