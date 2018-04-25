<template>
    <v-layout wrap>
        <v-flex md12 xs12>
            <v-btn  @click="$router.go(-1)">back</v-btn>
            Network Details     
        </v-flex>
        <v-flex md6 xs12>
            <v-card>
                <v-card-title>{{net.name}}</v-card-title>
                <v-card-text>
                    <v-list>
                        <v-list-item>
                            {{net.type}}
                        </v-list-item>
                    </v-list>
                    <v-list>
                        <v-list-item>
                            {{net.tags}}
                        </v-list-item>
                    </v-list>
                    <v-list>
                        <v-list-item>
                            {{net.timeZone}}
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-list>
                        <v-list-item>
                            <v-btn flat color="orange">EDIT</v-btn>
                        </v-list-item>
                    </v-list>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    props: ['net'],
    data: function () {
      return {
        
      }
    }
}
</script>
