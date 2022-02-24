exports.index = async (req, res) => {
    try {
        return res.page('teacher/index')
    } catch (error) {}
}
