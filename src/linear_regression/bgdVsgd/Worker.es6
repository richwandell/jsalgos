import Batch from './Batch';
import Stochastic from './Stochastic';


class Worker{

    handleMessage(e){
        console.log('Message received from main script');
        console.log(e.data);
        switch(e.data.action) {
            case 'SET_WORKER_VARS':
                switch(e.data.workerType){
                    case "BATCH":
                        this.worker = new Batch(e.data.measurements, e.data.realNumbers, e.data.batchNum);
                        break;

                    case "STOCHASTIC":
                        this.worker = new Stochastic(e.data.measurements, e.data.realNumbers, e.data.batchNum);
                        break;
                }
                this.worker.start();
                break;
        }
    }
}

const w = new Worker();

onmessage = (e) => {
    w.handleMessage(e);
};
