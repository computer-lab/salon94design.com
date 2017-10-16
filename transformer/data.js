const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')

module.exports = {
  getDesigners,
  getProjects,
  updateDesignerFile,
  updateProjectFile,
  resetDesignerFile,
  resetProjectFile
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

const designerFileName = data => path.join(designerDir, `${data.slug.trim()}.yml`)
const projectFileName = data => path.join(projectDir, `${data.slug.trim()}.yml`)

async function updateDesignerFile (data) {
  // write updated designer to same file
  await writeYamlFile(data, designerFileName(data))
}

async function resetDesignerFile (oldData, data) {
  await resetYamlFile(oldData, data, designerFileName)
}

async function updateProjectFile (data) {
  // write updated designer to same file
  await writeYamlFile(data, projectFileName(data))
}

async function resetProjectFile (oldData, data) {
  await resetYamlFile(oldData, data, projectFileName)
}

async function writeYamlFile (data, file) {
  const yamlData = yaml.safeDump(data)
  await fs.writeFile(file, yamlData)
}

async function resetYamlFile (oldData, data, fileMaker) {
  const newDataFile = fileMaker(data)

  // remove old duplicate file if necessary
  const oldDataFile = fileMaker(oldData)
  console.log(oldDataFile, newDataFile)
  if (oldDataFile !== newDataFile) {
    await fs.remove(oldDataFile)
  }

  // write new file
  await writeYamlFile(data, newDataFile)
}
