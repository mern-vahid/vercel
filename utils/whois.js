module.exports = (list, id, null_msg = 'null') => {
    console.log(id)
    if (!id) {
        return { null_msg }
    }
    if (id.length > 0) {
        let find = []
        list.map((l) => {
            id.map((i) => {
                l.id == i ? find.push(l) : null
            })
        })
        console.log('test', find)
        return find
    }
    if (id) {
        const d = list.find((l) => l.id == id)
        console.log(d.id)
        return d
    }
}
