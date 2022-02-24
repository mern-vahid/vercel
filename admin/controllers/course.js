const { v4: uuid4 } = require('uuid')
const slugify = require('slugify')

const Category = require('../../models/category')
const Courses = require('../../models/course')
const Users = require('../../models/users')

const whois = require('../../utils/whois')
const check = require('../../utils/is')
const errors_helper = require('../../utils/errors')
const { upload_image, delete_file } = require('../../utils/upload_image')

const layout = './layouts/admin'

exports.create = async (req, res) => {
    const categories = await Category.find({ status: true })
    return res.page('admin/course/create', {
        layout,
        categories,
        errors_helper,
        error: req.flash('error'),
        title: 'Admin | Add New Course',
    })
}

exports._create = async (req, res) => {
    let { name, category } = req.body
    console.log(category)
    try {
        const thumbnail = req.files ? req.files.thumbnail : false
        await Courses.valid(req.body)
        const find = await Courses.findOne({ name })

        if (find)
            return res.reflash('error', [
                { path: 'name', error: 'Name is unique' },
            ])

        if (!thumbnail)
            return res.reflash('error', [
                { path: 'thumbnail', error: 'thumbnail is required' },
            ])

        if (!category)
            return res.reflash('error', [
                { path: 'category', error: 'category is required' },
            ])

        let is_cat = true
        category = typeof category == 'string' ? [category] : category
        category.map(async (cat) => {
            let c = await Category.findError(cat)
            if (c == false) {
                return false
            }
            return (is_cat = false)
        })

        if (!is_cat) {
            return res.reflash('error', [
                { path: 'category', error: 'category is required' },
            ])
        }

        const now = new Date()
        const file_name = `${uuid4()}-${now.getFullYear()}-${now.getMonth()}-${now.getDay()}.${
            thumbnail.mimetype.split('/')[1]
        }`

        const slug = await slugify(name)
        await Courses.create({
            name,
            category,
            slug,
            teacher: req.user.id,
            thumbnail: file_name,
        })

        upload_image(
            '/static' + '/upload' + '/course',
            file_name,
            thumbnail.data,
            100
        )
        return res.redirect('/admin/course')
    } catch (error) {
        const arr = []

        if (error.inner) {
            error.inner.map((err) => {
                arr.push({ path: err.path, error: err.errors })
            })
            return res.reflash('error', arr)
        }
        console.log(error)
        return res.code(500)
    }
}

exports.index = async (req, res) => {
    try {
        const courses = await Courses.find()
        const categories = await Category.find()
        const users = await Users.find()

        return res.page('admin/course/index', {
            title: 'Admin | List Courses',
            whois,
            courses,
            categories,
            users,
            check,
        })
    } catch (error) {}
}

exports.status = async (req, res) => {
    const { id } = req.params
    try {
        const course = await Courses.findError(id)
        if (!course) {
            return res.code(404)
        }
        console.log(course)
        course.status = !course.status
        course.save()
        res.redirect('/admin/course')
    } catch (error) {}
}

exports._delete = async (req, res) => {
    const { id } = req.params
    try {
        const course = await Courses.findError(id)
        if (!course) return res.code(404)

        delete_file('/static/upload/course', course.thumbnail)
        await Courses.deleteOne({ _id: id })
        return res.redirect('/admin/course')
    } catch (error) {}
}

exports.edit = async (req, res) => {
    const { id } = req.params
    try {
        const course = await Courses.findError(id)
        if (!course) return res.code()

        const categories = await Category.find({ status: true })
        return res.page('admin/course/edit', {
            title: `Admin | Edit Course ${course.name}`,
            categories,
            course,
            errors_helper,
            error: req.flash('error'),
        })
    } catch (error) {}
}

exports._edit = async (req, res) => {
    console.log('Hello')
    const { id } = req.params
    let { category, name } = req.body
    try {
        let find = await Courses.findError(id)
        if (!find) return res.code()

        await Courses.valid(req.body)

        let find_by_name = await Courses.findOne({ name })
        let filter = find_by_name.id != find.id ? true : false

        if (filter)
            return res.reflash('error', [
                { path: 'name', error: `The ${name} is available` },
            ])

        if (!category) {
            return res.reflash('error', [
                { path: 'category', error: 'category is required' },
            ])
        }
        let is_cat = true

        category = typeof category == 'string' ? [category] : category
        category.map(async (cat) => {
            let c = await Category.findError(cat)
            if (c == false) {
                return false
            }
            return (is_cat = false)
        })

        if (!is_cat) {
            return res.reflash('error', [
                { path: 'category', error: 'category is required' },
            ])
        }

        const thumbnail = req.files ? req.files.thumbnail : false

        const now = new Date()
        if (thumbnail) {
            const file_name = `${uuid4()}-${now.getFullYear()}-${now.getMonth()}-${now.getDay()}.${
                thumbnail.mimetype.split('/')[1]
            }`
            upload_image(
                '/static' + '/upload' + '/course',
                file_name,
                thumbnail.data
            )

            delete_file('/static' + '/upload' + '/course', find.thumbnail)
            await Courses.updateOne(
                { _id: id },
                {
                    name,
                    slug: await slugify(name),
                    category: category,
                    thumbnail: file_name,
                }
            )
        } else {
            await Courses.updateOne(
                { _id: id },
                {
                    name,
                    slug: await slugify(name),
                    category: category,
                }
            )
        }
        return res.redirect('/admin/course')
    } catch (error) {
        console.log(error)
        res.code(500)
    }
}
