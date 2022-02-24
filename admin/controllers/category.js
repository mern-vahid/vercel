const Category = require('../../models/category')
const Users = require('../../models/users')

const errors_helper = require('../../utils/errors')
const check = require('../../utils/is')
const whois = require('../../utils/whois')
const slugify = require('slugify')

const layout = './layouts/admin'

exports.create = async (req, res) => {
    const category = await Category.find().where({ status: true })
    return res.page('admin/category/create', {
        title: 'Admin | New Category',
        error: req.flash('error'),
        errors_helper,
        category,
        layout,
    })
}

exports._create = async (req, res) => {
    const { name, category } = req.body
    try {
        await Category.valid(req.body)
        const category_find = await Category.findOne({ name: name })
        if (category_find) {
            return res.reflash('error', [
                { path: 'name', error: 'Category Is Exists' },
            ])
        }
        if (category.length > 0) {
            const category_find = await Category.findOne({ _id: category })
            if (!category_find) {
                return res.reflash('error', [
                    { path: 'category', error: 'Category Not Found' },
                ])
            }
            await Category.create({
                name,
                root: category,
                create_by: req.user.id,
                slug: slugify(name),
            })
            return res.redirect('/admin/category')
        }

        await Category.create({
            name,
            slug: slugify(name),
            create_by: req.user.id,
        })
        console.log(category.length, name)

        return res.redirect('/admin/category')
    } catch (error) {
        console.log(error)
        const arr = []

        if (error.inner) {
            error.inner.map((err) => {
                arr.push({ path: err.path, error: err.errors })
            })

            return res.reflash('error', arr)
        }
        return res.code(500, 'Server Internal Error')
    }
}

exports.index = async (req, res) => {
    const { search } = req.query
    try {
        let categories = await Category.find()
        const users = await Users.find()

        if (search) {
            const filter = categories.filter(
                (category) => category.name == search
            )
            categories = filter
        }

        return res.page('admin/category/index', {
            layout,
            title: 'Admin | Category List',
            categories,
            check,
            whois,
            users,
        })
    } catch (error) {
        console.log(error)
        return res.code(500)
    }
}

exports.status = async (req, res) => {
    const { id } = req.params
    try {
        const category = await Category.findError(id)

        if (!category) return res.code(404)

        await (
            await Category.find({ root: category.id, status: true })
        ).map((cat) => {
            cat.status = false
            cat.save()
        })
        category.status = !category.status
        category.save()
        res.redirect('back')
    } catch (error) {
        console.log(error)
        return res.code(500)
    }
}

exports._delete = async (req, res) => {
    const { id } = req.params
    try {
        const category = await Category.findOne({ _id: id })
        if (!category) {
            return res.code(404)
        }
        await (
            await Category.find({ root: id })
        ).map((cat) => {
            cat.root = null
            cat.save()
        })

        await Category.deleteOne({ _id: id })
        res.redirect('back')
    } catch (error) {
        return res.code(500)
    }
}

exports.edit = async (req, res) => {
    const { id } = req.params
    try {
        const category = await Category.findError(id)
        if (!category) return res.code(404)

        const categories = await (
            await Category.find()
        ).filter((cat) => cat.id != id)
        console.log(categories)
        return res.page('admin/category/edit', {
            layout,
            title: `Admin | ${category.name} Edit`,
            category,
            categories,
            error: req.flash('error'),
            errors_helper,
        })
    } catch (error) {
        console.log(error)
        return res.code(500)
    }
}

exports._edit = async (req, res) => {
    const { name, category } = req.body
    const { id } = req.params
    try {
        const _category = await Category.findError(id)
        if (!_category) return res.code(404)
        await Category.valid(req.body)
        const category_find = await Category.findOne({ name: name })
        if (category_find && name != _category.name) {
            return res.reflash('error', [
                { path: 'name', error: 'Category Is Exists' },
            ])
        }
        if (category.length > 0) {
            const category_find = await Category.findOne({ _id: category })
            if (!category_find) {
                return res.reflash('error', [
                    { path: 'category', error: 'Category Not Found' },
                ])
            }
            console.log(category)
            await Category.findByIdAndUpdate(_category._id, {
                name,
                root: category,
                create_by: req.user.id,
                slug: slugify(name),
            })
            return res.redirect('/admin/category')
        }

        await Category.findByIdAndUpdate(_category._id, {
            name,
            slug: slugify(name),
            create_by: req.user.id,
        })

        return res.redirect('/admin/category')
    } catch (error) {
        console.log(error)
        const arr = []

        if (error.inner) {
            error.inner.map((err) => {
                arr.push({ path: err.path, error: err.errors })
            })

            return res.reflash('error', arr)
        }
        return res.code(500, 'Server Internal Error')
    }
}
