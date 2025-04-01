let count = 1;
const db = {
    sensores: {
        humedad: 70,
        temperatura: 35,
        lluvia: 4,
        sol: 90,
    },
    parcelas: [
        
        {
            "id": 2,
            "nombre": "Bejorro",
            "ubicacion": "Zona Sur",
            "responsable": "Ana González",
            "tipo_cultivo": "Maíz",
            "ultimo_riego": "2025-03-29 09:42:27",
            "sensor": {
                "humedad": 25.10000000000000142108547152020037174224853515625,
                "temperatura": 29,
                "lluvia": 5.5,
                "sol": 40
            },
            "latitud": 21.065584181227695381721787271089851856231689453125,
            "longitud": -86.8964427183662877496317378245294094085693359375
        },
        {
            "id": 4,
            "nombre": "Chikin",
            "ubicacion": "Zona Oeste",
            "responsable": "María López",
            "tipo_cultivo": "Naranja Agria",
            "ultimo_riego": "2025-03-29 09:42:27",
            "sensor": {
                "humedad": 15.199999999999999289457264239899814128875732421875,
                "temperatura": 28.5,
                "lluvia": 1.1999999999999999555910790149937383830547332763671875,
                "sol": 70
            },
            "latitud": 21.05595861697890569530500215478241443634033203125,
            "longitud": -86.9014221707197265232025529257953166961669921875
        },
        {
            "id": 5,
            "nombre": "Tzi",
            "ubicacion": "Zona Centro",
            "responsable": "José Martínez",
            "tipo_cultivo": "Chiles Serranos",
            "ultimo_riego": "2025-03-29 09:42:27",
            "sensor": {
                "humedad": 70,
                "temperatura": 27.10000000000000142108547152020037174224853515625,
                "lluvia": 1.1999999999999999555910790149937383830547332763671875,
                "sol": 90
            },
            "latitud": 21.06334380377359849489948828704655170440673828125,
            "longitud": -86.88817327070790952348033897578716278076171875
        },
        {
            "id": 6,
            "nombre": "Chak",
            "ubicacion": "Zona Norte",
            "responsable": "Patricia Sánchez",
            "tipo_cultivo": "Chaya",
            "ultimo_riego": "2025-03-29 09:42:27",
            "sensor": {
                "humedad": 35.7000000000000028421709430404007434844970703125,
                "temperatura": 30.10000000000000142108547152020037174224853515625,
                "lluvia": 9.300000000000000710542735760100185871124267578125,
                "sol": 70
            },
            "latitud": 21.06284593753515110847729374654591083526611328125,
            "longitud": -86.8569627747069290535364416427910327911376953125
        },
        {
            "id": 7,
            "nombre": "Xunaan",
            "ubicacion": "Zona Sur",
            "responsable": "Luis Gómez",
            "tipo_cultivo": "Lechuga",
            "ultimo_riego": "2025-03-29 09:42:27",
            "sensor": {
                "humedad": 35.7000000000000028421709430404007434844970703125,
                "temperatura": 30.10000000000000142108547152020037174224853515625,
                "lluvia": 9,
                "sol": 40
            },
            "latitud": 21.05548256468075152270102989859879016876220703125,
            "longitud": -86.87216813213257182724191807210445404052734375
        },
        {
            "id": 8,
            "nombre": "Ki’ichpam",
            "ubicacion": "Zona Este",
            "responsable": "Elena Díaz",
            "tipo_cultivo": "Cebolla Morada",
            "ultimo_riego": "2025-03-29 09:42:27",
            "sensor": {
                "humedad": 5.5,
                "temperatura": 25.5,
                "lluvia": 1.1999999999999999555910790149937383830547332763671875,
                "sol": 50
            },
            "latitud": 21.069979963109926046627151663415133953094482421875,
            "longitud": -86.8810086933183782775813597254455089569091796875
        },
        {
            "id": 9,
            "nombre": "Balam",
            "ubicacion": "Zona Oeste",
            "responsable": "Ricardo Torres",
            "tipo_cultivo": "Zanahorias",
            "ultimo_riego": "2025-03-29 09:42:27",
            "sensor": {
                "humedad": 15.199999999999999289457264239899814128875732421875,
                "temperatura": 27.10000000000000142108547152020037174224853515625,
                "lluvia": 9.300000000000000710542735760100185871124267578125,
                "sol": 30
            },
            "latitud": 21.0759558593103264456658507697284221649169921875,
            "longitud": -86.8815932800980164074644562788307666778564453125
        },
        {
            "id": 10,
            "nombre": "Cha’ach",
            "ubicacion": "Zona Centro",
            "responsable": "Laura Ramírez",
            "tipo_cultivo": "Chile Habanero",
            "ultimo_riego": "2025-03-29 09:42:27",
            "sensor": {
                "humedad": 90,
                "temperatura": 27.10000000000000142108547152020037174224853515625,
                "lluvia": 9,
                "sol": 10
            },
            "latitud": 21.07744932136746029982532490976154804229736328125,
            "longitud": -86.893952992189582573701045475900173187255859375
        },
        {
            "id": 11,
            "nombre": "Noh",
            "ubicacion": "Zona Poniente",
            "responsable": "Laura Ramírez",
            "tipo_cultivo": "Calabaza",
            "ultimo_riego": "2025-03-29 09:42:27",
            "sensor": {
                "humedad": 35.7000000000000028421709430404007434844970703125,
                "temperatura": 30.10000000000000142108547152020037174224853515625,
                "lluvia": 9.300000000000000710542735760100185871124267578125,
                "sol": 30
            },
            "latitud": 21.06749708353289207707348396070301532745361328125,
            "longitud": -86.87156731729470493519329465925693511962890625
        }
    ]
}

const fakeApiSensors = (req, res) => {

    const actualizarSensores = () => {
        db.sensores = {
            humedad: Math.floor(Math.random() * (80 - 30 + 1) + 30), // 30 - 80
            temperatura: Math.floor(Math.random() * (40 - 10 + 1) + 10), // 10 - 40
            lluvia: Math.random() < 0.5 ? 4 : 1.2, // Alterna entre 4 y 1.2
            sol: Math.floor(Math.random() * (100 - 20 + 1) + 20), // 20 - 100
        };
        console.log("Nuevo estado de sensores:", db.sensores);
    };

    console.log(count);
    actualizarSensores();


    count++;

    return res.send(db);
};

export {
    fakeApiSensors
}
