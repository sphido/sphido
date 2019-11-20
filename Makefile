
# yarn lerna publish --force-publish="*" --no-push --no-git-tag-version

publish:
	yarn lerna version --force-publish="*"
	yarn lerna publish from-git