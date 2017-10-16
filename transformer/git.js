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
  return new Promise((resolve, reject) => {
    repo.pull('origin', 'master', err => {
      if (err) {
        console.error('error pulling: ', err)
        return reject(err)
      }

      resolve()
    })
  })
}

async function pushChanges () {
  let repo = simpleGit(gitDir)
  return new Promise((resolve, reject) => {
    repo.diff((err, diff) => {
      if (err) {
        console.error('error diffing: ', err)
        return reject(err)
      }

      const hasDiff = diff.length > 0
      if (!hasDiff) {
        return resolve()
      }

      repo = repo
        .add('./*')
        .commit('data processing')

      repo.push('origin', 'master', err => {
        if (err) {
          console.error('error commiting changes:', err)
          return reject(err)
        }

        resolve()
      })
    })
  })
}
