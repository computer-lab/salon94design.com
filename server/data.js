const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')

module.exports = {
  getDesigners,
  getProjects,
  updateDesignerFile,
  updateProjectFile
}

const designerDir = path.join(__dirname, '../src/data/designers')
const projectDir = path.join(__dirname, '../src/data/projects')

async function getDesigners () {
  const designerFiles = readdirAbsolute(designerDir)
  const designers = await getYamlDatas(designerFiles)
  return designers
}

async function getProjects () {
  const projectFiles = readdirAbsolute(projectDir)
  const projects = await getYamlDatas(projectFiles)
  return projects
}

async function getYamlDatas (files) {
  const datas = await Promise.all(files.map(file => {
    return fs.readFile(file, 'utf8')
      .then(str => yaml.safeLoad(str))
      .catch(err => {
        console.error('err reading yaml: ', file)
        console.error(err)
        return null
      })
  }))

  return datas
}

function readdirAbsolute (dir) {
  return fs.readdirSync(dir).map(f => path.join(dir, f))
}

async function updateDesignerFile (data) {
  // write updated designer to same file
  const file = path.join(designerDir, `${data.slug}.yml`)
  await writeYamlFile(data, file)
}

async function updateProjectFile (data) {
  // write updated designer to same file
  const file = path.join(projectDir, `${data.slug}.yml`)
  await writeYamlFile(data, file)
}

async function writeYamlFile (data, file) {
  const yamlData = yaml.safeDump(data)
  await fs.writeFile(file, yamlData)
}
