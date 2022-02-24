const appRoot = require('app-root-path')
const sharp = require('sharp')
const { v4: uuid4 } = require('uuid')

const fs = require('fs')

exports.upload_image = async (_file_path, file_name, data, quality = 60) => {
    const file_path = appRoot + _file_path + '/' + file_name
    appRoot +
        (await sharp(data)
            .jpeg({ quality })
            .toFile(file_path)
            .catch((err) => console.log(err)))
}

exports.delete_file = async (file_path, file_name) => {
    fs.unlink(appRoot + file_path + '/' + file_name, (err) => {
        if (err) throw err
        console.log(`successfully deleted ${file_path}/${file_name}`)
    })
}

exports.file_name = async (name) => {
    const now = new Date()
    const file_name = `${uuid4()}-${now.getFullYear()}-${now.getMonth()}-${now.getDay()}.${name}`
    return file_name
}
