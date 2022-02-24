module.exports = (errors, path) => {
  for (let index = 0; index < errors.length; index++) {
    if (path == errors[index].path) {
      return `<div class="mt-2">
      <span class="text-danger">${errors[index].error}</span>
      <hr class="bg bg-danger" />
      </div>`
    }
  }
}
