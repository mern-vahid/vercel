const layout = './layouts/admin'

exports.index = async (req, res) => {
    res.page('admin/index', { title: 'Admin Panel', layout })
}
