module.exports = (bool) => {
    if (bool == true) {
        return `<span class="text-dark"><i style="font-size: 16px !important" class="fe fe-check-circle me-1 fs-6 text-success"></i></span>`
    } else {
        return `<span class="text-dark"><i class="fe fe-alert-circle me-1 fs-6 text-danger" style="font-size: 16px !important"></i></span>`
    }
}
