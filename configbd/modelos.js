module.exports = {

  legislators: {
     identity: 'legislators',
     connection: 'baseborde',
     tableName: "legislators",
     attributes: {
       trabajo: {
         collection: 'legislative_work',
         via: 'autores'
       },
       trabajopoint: {
         collection: 'legislative_workpoint',
         via: 'autores'
       },
       trabajovotation: {
         collection: 'legislative_votation',
         via: 'autores'
       },
       comision: {
         collection: 'commissions',
         via: 'com_leg'
       }
     }
  },

  legislative_work: {
     identity: 'legislative_work',
     connection: 'baseborde',
     tableName: "legislative_work",
     attributes: {
       id_legislative_work:{
        type: 'string'
       },
       autores: {
         collection: 'legislators',
         via: 'trabajo'
       }
    }
  },

  legislative_workpoint: {
     identity: 'legislative_workpoint',
     connection: 'baseborde',
     tableName: "legislative_workpoint",
     attributes: {
       id_legislative_work_point:{
        type: 'string'
       },
       autores: {
         collection: 'legislators',
         via: 'trabajopoint'
       }
    }
  },

  legislative_votation: {
     identity: 'legislative_votation',
     connection: 'baseborde',
     tableName: "legislative_votation",
     attributes: {
       id_legislative_votation:{
        type: 'string'
       },
       autores: {
         collection: 'legislators',
         via: 'trabajovotation'
       }
    }
  },

  commissions: {
     identity: 'commissions',
     connection: 'baseborde',
     tableName: "commissions",
     attributes: {
       com_leg: {
         collection: 'legislators',
         via: 'comision'
       }
    }
  },

  legislators_leg_ant: {
       identity: 'legislators_leg_ant',
       connection: 'baseborde',
       tableName: "legislators_leg_ant",
       attributes: {
         id_legislator_leg_ant:{
          type: 'string'
         }
      }
  }
}
