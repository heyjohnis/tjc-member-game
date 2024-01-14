export function f_gabza_str(str) {
    let $no = 0;

    switch (str) {
        case "甲": $no = 1; break;
        case "乙": $no = 2; break;
        case "丙": $no = 3; break;
        case "丁": $no = 4; break;
        case "戊": $no = 5; break;
        case "己": $no = 6; break;
        case "庚": $no = 7; break;
        case "辛": $no = 8; break;
        case "壬": $no = 9; break;
        case "癸": $no = 10; break;
    }

    return $no;
}

export function colorToHanja(color) {
    switch (color) {
        case '파':
            return '木'
        case '빨':
            return '火'
        case '노':
            return '土'
        case '하':
            return '金'
        case '검':
            return '水'
    }
}

export function colorDeawun(color) {
    switch (color) {
        case '파':
            return '푸른'
        case '빨':
            return '붉은'
        case '노':
            return '황금'
        case '하':
            return '하얀'
        case '검':
            return '검은'
    }
}

export function colorEngName(color) {
    switch (color) {
        case '파':
            return 'blue'
        case '빨':
            return 'red'
        case '노':
            return 'yellow'
        case '하':
            return 'white'
        case '검':
            return 'black'
        default:
            return ''
    }
}

export function colorKorName(engName) {
    switch (engName) {
        case 'blue':
            return '파'
        case 'red':
            return '빨'
        case 'yellow':
            return '노'
        case 'white':
            return '하'
        case 'black':
            return '하'
        default:
            return ''
    }
}

export function colorFullName(color) {
    switch (color) {
        case '파':
            return '파랑색'
        case '빨':
            return '빨간색'
        case '노':
            return '노랑색'
        case '하':
            return '하얀색'
        case '검':
            return '검정색'
        default:
            return '없음'
    }
}

/**
 * 지지를 영어 필드명으로 치환함
 * @param {*} $jiji 
 * @returns 
 */
export function replaceWord1($jiji) {

    switch ($jiji) {
        case '자':
            return 'mouse'
        case '축':
            return 'cow'
        case '인':
            return 'tiger'
        case '묘':
            return 'rabbit'
        case '진':
            return 'dragon'
        case '사':
            return 'snake'
        case '오':
            return 'horse'
        case '미':
            return 'lamb'
        case '신':
            return 'monkey'
        case '유':
            return 'hen'
        case '술':
            return 'dog'
        case '해':
            return 'pig'

    }
}

/**
 * 천간을 영어 필드명으로 치환함
 * @param {*} $gan 
 * @returns 
 */
export function replaceWord2($gan) {

    switch ($gan) {
        case '갑':
            return 'd_gap'
        case '을':
            return 'd_uel'
        case '병':
            return 'd_byung'
        case '정':
            return 'd_jeong'
        case '무':
            return 'd_mu'
        case '기':
            return 'd_gi'
        case '경':
            return 'd_gyung'
        case '신':
            return 'd_sin'
        case '임':
            return 'd_im'
        case '계':
            return 'd_ge'

    }

}

/**
 * 천간을 한자어로 치환함
 * @param {*} $gan 
 * @returns 
 */
export function replaceWord3($gan) {

    switch ($gan) {
        case '갑':
            return '甲'
        case '을':
            return '乙'
        case '병':
            return '丙'
        case '정':
            return '丁'
        case '무':
            return '戊'
        case '기':
            return '己'
        case '경':
            return '庚'
        case '신':
            return '辛'
        case '임':
            return '壬'
        case '계':
            return '癸'
    }

}


/**
 * 지지를 한자어로 치환함
 * @param {*} $jiji 
 * @returns 
 */
export function replaceWord4($jiji) {

    switch ($jiji) {
        case '자':
            return '子'
        case '축':
            return '丑'
        case '인':
            return '寅'
        case '묘':
            return '卯'
        case '진':
            return '辰'
        case '사':
            return '巳'
        case '오':
            return '午'
        case '미':
            return '未'
        case '신':
            return '申'
        case '유':
            return '酉'
        case '술':
            return '戌'
        case '해':
            return '亥'
    }
}

/**
 * 월12진법을 12지지 영문으로 치환함
 * 지지를 영어 필드명으로 치환함
 * @param {*} $twlv 
 * @returns 
 */
export function replaceWord5($twlv) {

    switch ($twlv) {
        case '天貴':
            return 'mouse'
        case '天厄':
            return 'cow'
        case '天權':
            return 'tiger'
        case '天破':
            return 'rabbit'
        case '天奸':
            return 'dragon'
        case '天文':
            return 'snake'
        case '天福':
            return 'horse'
        case '天驛':
            return 'lamb'
        case '天孤':
            return 'monkey'
        case '天刃':
            return 'hen'
        case '天藝':
            return 'dog'
        case '天壽':
            return 'pig'
    }
}

/**
 * 지지를 12진법으로 치환함
 * @param {*} $jiji 
 * @returns 
 */
export function replaceWord6($jiji) {

    switch ($jiji) {
        case '자':
            return '1'
        case '축':
            return '2'
        case '인':
            return '3'
        case '묘':
            return '4'
        case '진':
            return '5'
        case '사':
            return '6'
        case '오':
            return '7'
        case '미':
            return '8'
        case '신':
            return '9'
        case '유':
            return '10'
        case '술':
            return '11'
        case '해':
            return '12'
    }
}

export function removeHtml(str) {
    return str.toLowerCase().replace(/<p[^>]*>/gi, "") //p태그
        .replace(/<img[^>]*>/gi, "") //이미지
        .replace(/<br[^>]*>/gi, "") //BR
        .replace(/<font[^>]*>/gi, "") //font
        .replace(/&nbsp;/gi, "") //공백
        .replace(/<p[^>]*>/gi, "") //p태그
        .replace(/<\/p[^>]*>/gi, "")
        .replace(/\n|\r/g, "")
}

export function zodiacYear10(year) {
    switch (year) {
        case 0:
            return '경'
        case 1:
            return '신'
        case 2:
            return '임'
        case 3:
            return '계'
        case 4:
            return '갑'
        case 5:
            return '을'
        case 6:
            return '병'
        case 7:
            return '정'
        case 8:
            return '무'
        case 9:
            return '기'
    }
}

export function zodiacYear12(year) {
    switch (year) {
        case 0:
            return '신'
        case 1:
            return '유'
        case 2:
            return '술'
        case 3:
            return '해'
        case 4:
            return '자'
        case 5:
            return '축'
        case 6:
            return '인'
        case 7:
            return '묘'
        case 8:
            return '진'
        case 9:
            return '사'
        case 10:
            return '오'
        case 11:
            return '미'
    }
}