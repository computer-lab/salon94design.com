const path = require('path')
const { promisify } = require('util')
const simpleGit = require('simple-git')

module.exports = {
  pullRepo,
  pushChanges,
}

const gitDir = path.join(__dirname, '../')

function pullRepo () {
  const repo = simpleGit(gitDir)
  const pull = promisify(repo.pull).bind(repo)
  return pull('origin', 'master')
    .catch(err => {
      console.error('error pulling: ', err)
    })
}

async function pushChanges () {
  let repo = simpleGit(gitDir)
  const repoDiff = promisify(repo.diff).bind(repo)

  try {
    const diff = await repoDiff()
    const hasDiff = diff.length > 0
    if (!hasDiff) {
      return
    }

    repo = repo
      .add('./*')
      .commit('data processing')

    const repoPush = promisify(repo.push).bind(repo)
    await repoPush('origin', 'master')
  } catch (err) {
    console.error('error commiting changes:', err)
  }
}
