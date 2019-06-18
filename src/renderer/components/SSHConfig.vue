<template>
  <v-layout ma-3>
    <el-dialog title="Add Config Entry"
    :visible="showAddConfigEntryDialog"
    width="50%"
    center>
    <el-form>
      <el-form-item label="Hostname">
        <el-input v-model="configEntryHost">
        </el-input>
      </el-form-item>
      <el-form-item label="IdentityFile">
        <el-input v-if="configEntryIdentityFilePath !== ''" v-model="configEntryIdentityFilePath">

        </el-input>
        <p class="text-xs-center" v-else>
          <br />
          <v-layout row>
            <v-flex xs4>
              <el-input v-model="configEntryIdentityFileName" />
            </v-flex>
            <v-flex xs4>
              <el-input v-model="configEntryIdentityFileBitLength" />
            </v-flex>
            <v-flex xs4>
              <el-button :loading="$wait.is('creating_keypair')" size="medium" @click="createSSHKeyPairView(parseInt(configEntryIdentityFileBitLength), configEntryIdentityFileName)">Create keypair</el-button>
            </v-flex>
          </v-layout>
          <el-button size="medium">Browse keyfile</el-button>
        </p>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeAddConfigEntryDialog">Cancel</el-button>
      <el-button type="primary" @click="addConfigEntryView">Add</el-button>
    </span>
    </el-dialog>
    <v-layout column>
      <v-flex xs2>
        <el-button @click="openAddConfigEntryDialog" size="medium">
          Add
        </el-button>
      </v-flex>
      <v-flex xs10>
        <v-list>
          <v-list-tile v-for="configItem in configData" :key="configItem.host">
            <v-list-tile-content>
              <span class="body-2">
                {{configItem.host}}
              </span>
              <span>
                {{configItem.identityFile}}
              </span>
            </v-list-tile-content>
            <v-list-tile-action>
              <el-button icon="el-icon-remove" type="danger" size="mini"/>
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
      showAddConfigEntryDialog: true,
      configEntryHost: '',
      configEntryIdentityFilePath: '',
      configEntryIdentityFileBitLength: 1024,
      configEntryIdentityFileName: ''
    }
  },
  computed: {
    ...mapState('sshManager', ['configData'])
  },
  methods: {
    openAddConfigEntryDialog () {
      this.showAddConfigEntryDialog = true
    },
    closeAddConfigEntryDialog () {
      this.showAddConfigEntryDialog = false
    },
    addConfigEntryView () {
      this.closeAddConfigEntryDialog()
      if (this.configEntryIdentityFilePath === '') {
      }
    }
  }
}
</script>

<style>

</style>
