const layout = './layouts/admin'
const slugify = require('slugify')

const Courses = require('../../models/course')
const Users = require('../../models/users')

const whois = require('../../utils/whois')
const check = require('../../utils/is')
const errors_helper = require('../../utils/errors')
const Lesson_category = require('../../models/lesson_category')

exports.create = async (req, res) => {
    const courses = await Courses.find({ status: true, teacher: req.user.id })
    return res.page('admin/lesson_category/create', {
        layout,
        courses,
        errors_helper,
        error: req.flash('error'),
        title: 'Admin | Add New Lesson Category',
    })
}

exports._create = async (req, res) => {
    const { course, name } = req.body
    try {
        await Lesson_category.valid(req.body)

        const course_find = await Courses.findOne({
            _id: course,
            teacher: req.user.id,
        }).catch((err) =>
            res.reflash('error', [
                { path: 'course', error: 'Please Select Course' },
            ])
        )
        if (!course_find) {
            return res.reflash('error', [
                { path: 'course', error: 'Please Select Course' },
            ])
        }
        const lesson_find = await Lesson_category.findOne({ name }).catch(
            (err) =>
                res.reflash('error', [
                    { path: 'name', error: `${name} is Exiest` },
                ])
        )

        await Lesson_category.create({
            name,
            course,
            slug: slugify(name),
            teacher: req.user.id,
        })

        return res.redirect('/admin/lesson/category')
    } catch (error) {
        console.log(error)
        let arr = []
        if (error.inner) {
            error.inner.map((err) => {
                arr.push({ path: err.path, error: err.errors })
            })

            return res.reflash('error', arr)
        }
        console.log(arr)
        return res.code(500)
    }
}

exports.index = async (req, res) => {
    try {
        const courses = await Courses.find({})
        const users = await Users.find({})
        let lesson_category
        lesson_category =
            req.user.is_owner === true
                ? await Lesson_category.find()
                : await Lesson_category.find({ teacher: req.user.id })
        return res.page('admin/lesson_category/index', {
            title: 'Admin | Lesson Category List',
            lesson_category,
            courses,
            users,
            layout,
            check,
            whois,
        })
    } catch (error) {
        console.log(error)
    }
}

exports._delete = async (req, res) => {
    const { id } = req.params
    try {
        const lesson_category = await Lesson_category.findError(id)
        if (!lesson_category) return res.code()
        if (
            req.user.id == lesson_category.teacher &&
            lesson_category.status == false
        ) {
            lesson_category.delete()
            return res.redirect('/admin/lesson/category')
        }
        if (req.user.is_owner == true) {
            lesson_category.delete()
            return res.redirect('/admin/lesson/category')
        }
        return res.code()
    } catch (error) {
        console.log(error)
        return res.code(500)
    }
}

exports.status = async (req, res) => {
    const { id } = req.params
    try {
        const lesson_category = await Lesson_category.findError(id)
        if (!lesson_category) return res.code()
        if (req.user.is_owner === true) {
            lesson_category.status = !lesson_category.status
            lesson_category.save()
            return res.redirect('/admin/lesson/category')
        } else {
            return res.code()
        }
    } catch (error) {
        return res.code(500)
    }
}
