const path = require('path')
const simpleGit = require('simple-git')

module.exports = {
  pullRepo,
  pushChanges,
}

const gitDir = path.join(__dirname, '../')

function pullRepo () {
  return new Promise((resolve, reject) => {
    const repo = simpleGit(gitDir)
    repo.pull('origin', 'master', err => {
      if (err) {
        console.error('error pulling: ', err)
        return reject(err)
      }

      resolve()
    })
  })
}

function pushChanges () {
  return new Promise((resolve, reject) => {
    const repo = simpleGit(gitDir)
    repo.diff((err, diff) => {
      if (err) {
        console.error('error reading git diff:', err)
        return reject(err)
      }

      const hasDiff = diff.length > 0
      if (!hasDiff) {
        console.log('no diff to commit')
        resolve()
      }

      repo
        .add('./*')
        .commit('data processing')
        .push('origin', 'master', err => {
          if (err) {
            console.error('error commiting and pushing:', err)
            return reject(err)
          }

          resolve()
        })
    })
  })
}
