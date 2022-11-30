// Skicka in i formatet YYYY-MM-DD 

/*
EXEMPEL:
convertDateToName("2022-03-21") -> "Mars 21, 2022"
*/ 

export function convertDateToName(string){ 

    const dict = {
        "01": "Januari",
        "02": "Februari",
        "03": "Mars",
        "04": "April",
        "05": "Maj",
        "06": "Juni",
        "07": "Juli",
        "08": "Augusti",
        "09": "September",
        "10": "Oktober",
        "11": "November",
        "12": "December",
    }

    const [y,m,d] = string.split("-");

    return `${dict[m]} ${d}, ${y}`

}