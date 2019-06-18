<template>
  <v-layout ma-3>
    <el-dialog :title="configEntryDialogTitle"
    :visible="showAddConfigEntryDialog"
    width="75%">
    <el-form>
      <v-layout row>
        <v-flex>
          <el-form-item label="Host">
            <el-input v-model="configEntryHost">
            </el-input>
          </el-form-item>
        </v-flex>
        <v-flex ml-1>
          <el-form-item label="Port">
            <el-input v-model="configEntryPort" />
          </el-form-item>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex>
          <el-form-item label="Hostname">
            <el-input v-model="configEntryHostname" />
          </el-form-item>
        </v-flex>
        <v-flex ml-1>
          <el-form-item label="User">
            <el-input v-model="configEntryUser" />
          </el-form-item>
        </v-flex>
      </v-layout>
      <el-form-item label="IdentityFile">
        <el-input  v-model="configEntryIdentityFilePath" v-if="configEntryIdentityFilePath !== ''">
        </el-input>
        <span v-else>
          <br />
          <el-radio v-model="configEntryIdentityFileOption" label="browse">Select</el-radio>
          <el-radio v-model="configEntryIdentityFileOption" label="create">Create</el-radio>
        </span>
        <br v-if="configEntryIdentityFilePath === ''" />
        <span v-if="configEntryIdentityFileOption === 'browse'">
          <el-button @click="selectIdentityFile" size="medium">
            Select
          </el-button>
          <el-button v-if="configEntryIdentityFilePath !== ''" size="medium" @click="configEntryIdentityFilePath = ''">Clear</el-button>
        </span>
        <p class="text-xs-center" v-else>
          <v-layout row v-if="!configEntryIdentityFileCreated">
            <v-flex xs4 mr-1>
              <el-input placeholder="Name (e.g. id_rsa)" v-model="configEntryIdentityFileName" />
            </v-flex>
            <v-flex xs4 mr-1>
              <el-input v-model="configEntryIdentityFileBitLength">
                <template slot="prepend">Bits</template>
              </el-input>
            </v-flex>
            <v-flex xs4>
              <el-button :disabled="configEntryIdentityFileName === ''" :loading="$wait.is('creating_keypair')" size="medium" @click="createSSHKeyPairView(parseInt(configEntryIdentityFileBitLength), configEntryIdentityFileName)">Create keypair</el-button>
            </v-flex>
          </v-layout>
          <v-layout v-else>
            Created Identityfile {{configEntryIdentityFileName}}
          </v-layout>
        </p>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeAddConfigEntryDialog">Cancel</el-button>
      <el-button v-if="!configEntryDialogEdit" type="primary" :loading="$wait.is('adding_config_entry')" @click="addConfigEntryView">Add</el-button>
      <el-button type="primary" @click="editConfigEntryView" v-else>Save</el-button>
    </span>
    </el-dialog>
    <v-layout column>
      <v-flex xs2>
        <el-button @click="openAddConfigEntryDialog(false)" size="medium">
          Add
        </el-button>
        <el-button @click="refreshConfigData" size="medium">
          Refresh
        </el-button>
      </v-flex>
      <v-flex xs10 mt-2>
        <v-list class="sshConfigEntryList">
          <v-list-tile v-for="(configItem, index) in configData" :key="index">
            <v-list-tile-content>
              <span class="body-2">
                {{configItem.host}} <span v-if="configItem.user">({{configItem.user}})</span>
              </span>
              <span>
                {{configItem.identityFile}}
              </span>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-layout row>
                <v-flex mr-1><el-button @click="openAddConfigEntryDialog(true, configItem)" icon="el-icon-edit" size="mini" /></v-flex>
                <v-flex><el-button @click="deleteConfigEntryView(configItem)" icon="el-icon-remove" type="danger" size="mini"/></v-flex>
              </v-layout>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import {mapState} from 'vuex'
import sshConfigController from '../controller/view/sshConfig'
export default {
  mixins: [sshConfigController],
  data () {
    return {
      showAddConfigEntryDialog: false,
      configEntryDialogEdit: false,
      configEntryHost: '',
      configEntryHostname: '',
      configEntryPort: '',
      configEntryUser: '',
      configEntryNumInFile: -1,
      configEntryIdentityFilePath: '',
      configEntryIdentityFileBitLength: 1024,
      configEntryIdentityFileName: '',
      configEntryIdentityFileOption: 'browse',
      configEntryIdentityFileCreated: false
    }
  },
  computed: {
    ...mapState('sshManager', ['configData']),
    configEntryDialogTitle () {
      return !this.configEntryDialogEdit ? 'Add config entry' : 'Edit config entry'
    }
  },
  methods: {
    openAddConfigEntryDialog (edit = false, configEntry) {
      this.showAddConfigEntryDialog = true
      if (edit === true) {
        this.configEntryDialogEdit = true
        this.configEntryHost = configEntry.host
        this.configEntryUser = configEntry.user ? configEntry.user : ''
        this.configEntryPort = configEntry.port ? configEntry.port : ''
        this.configEntryHostname = configEntry.hostname ? configEntry.hostname : ''
        this.configEntryIdentityFilePath = configEntry.identityFile ? configEntry.identityFile : ''
        this.configEntryNumInFile = configEntry.numInFile
        // this.configEntryPort
      }
    },
    closeAddConfigEntryDialog () {
      this.showAddConfigEntryDialog = false
      // dialog close blur
      this.configEntryDialogEdit = false
    }
  }
}
</script>

<style scoped>
  .sshConfigEntryList {
    max-height: 650px;
    overflow-y: auto;
  }
</style>
