const msg = require('fs')
    .readFileSync('.git/COMMIT_EDITMSG', 'utf-8')
    .trim()


const commitRE = /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/
const mergeRe = /^(Merge pull request|Merge branch)/
if (!commitRE.test(msg)) {
    if (!mergeRe.test(msg)) {
        console.log('git commit verify failed.')
        console.error(`git commit format error, need title(scope): desc
      e.g. fix: xxbug
      feat(test): add new 
    `)
        process.exit(1)
    }

} else {
    console.log('git commit verify success.')
}