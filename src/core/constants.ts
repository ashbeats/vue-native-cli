export const vueFileExtensions = ['vue']

export const regex = {
  validExpoDirName: /^[a-zA-Z0-9\-]+$/,
  validRNDirName: /^[$A-Z_][0-9A-Z_$]*$/i,
}

export enum PackageManagers {
  yarn = 'yarn',
  npm = 'npm',
}

export const expoPackageName = 'expo'

export const rnPackageName = 'react-native'

export const rnVersion = 'react-native@0.59'

export const appJsonPath = 'app.json'

export const vueNativePackages = {
  vueNativeCore: 'vue-native-core',
  vueNativeHelper: 'vue-native-helper',
  vueNativeScripts: 'vue-native-scripts',
}

export const vueNativeDependencies = [
  'vue-native-core@~0.1.0',
  'vue-native-helper@~0.1.0',
]

export const vueNativeDevDependencies = [
  'vue-native-scripts@~0.1.0',
  '@babel/core@^7.0.0',
]

export const metroConfigFileName = 'metro.config.js'

export const vueTransformerFileName = 'vueTransformerPlugin.js'

export const appVueFileName = 'App.vue'

export const expoAppJSONSourceExtsPath = 'expo.packagerOpts.sourceExts'
