function removeDuplicate(arr) {
    const newArr = []
    arr.forEach(item => {
        if (newArr.indexOf(item) === -1) {
            newArr.push(item)
        }
    })
    return newArr
}

export default removeDuplicate