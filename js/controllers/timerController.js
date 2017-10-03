function error(e) {
    console.log(e);
    alert("Error");
}
app.controller('timerController', function($rootScope,$interval,$websocket) {


    var conn =$websocket('ws://localhost:8080');

    conn.onOpen(function(e) {
        console.log("Connection established at " + new Date());
        
        $rootScope.circleStyle={};
        $rootScope.containerStyle={};
        $rootScope.timer= { set:{},elapsed:{minutes:"00",seconds:"00"}};
        scope = $rootScope;
        $rootScope.setCircleProgress=function (progress) {

            //https://codepen.io/HugoGiraudel/pen/BHEwo

            progress = (progress > 100)?100:progress;

            var completeCircle = 360;
            
            var percentComplete = completeCircle * (progress/100);

            $rootScope.circleStyle.spinner={transform:'rotate('+percentComplete+'deg)'};
            
            if(progress <= 50 )
            {

                $rootScope.circleStyle.filler = {opacity:0};

                $rootScope.circleStyle.mask = {opacity:1};

            }
            else
            {

                $rootScope.circleStyle.filler = {opacity:1};

                $rootScope.circleStyle.mask = {opacity:0};
            }
            
        }

        $rootScope.setBackgroundState=function (state) {

            switch (state)
            {
                case 1:

                    $rootScope.containerStyle.animation='none';
                    $rootScope.containerStyle.backgroundColor='#212121';
                    $rootScope.containerStyle.color='white';
                    break;
                case 2:
                    $rootScope.containerStyle.animation='none';
                    $rootScope.containerStyle.backgroundColor= '#FFEB3B';
                    $rootScope.containerStyle.color='black';
                    break;
                case 3:
                    $rootScope.containerStyle.color='black';
                    $rootScope.containerStyle.animation='intermitent 0.5s linear 0s infinite';

                    break;
            }
        }
        $rootScope.getTime=function(time)
        {

            var minutes = (Math.floor(time / 60)).toFixed(0);

            var seconds = ( time - minutes * 60).toFixed(0);

            return [minutes,seconds];
        }
        $rootScope.sendMsg=function (msg) {
            conn.send(JSON.stringify(msg));
        }

        $rootScope.$watchCollection("timer.set",function () {


            if($rootScope.timer.interval)
            {

                $rootScope.sendMsg({type:'change',set:$rootScope.timer.set});
            }

        },true);
        $rootScope.startTimer=function (remote) {

            if($rootScope.timer.interval)
            {
                $interval.cancel($rootScope.timer.interval);
            }

            var elapsed=0;

            var elapsedPercent =0;

            var interval=1000;

            var startTime = new Date();

            $rootScope.setBackgroundState(1);


            if(remote)
            {
                $rootScope.sendMsg({type:'start',timer:angular.copy($rootScope.timer)});
            }



            $rootScope.timer.interval= $interval(function () {

                var totalSeconds =  ($rootScope.timer.set.minutes*60)+$rootScope.timer.set.seconds;
                var now = new Date();
                elapsed =  Math.abs(now - startTime);
                var time = $rootScope.getTime((elapsed/1000));
                elapsedPercent =Math.ceil( ((elapsed/1000)*100) / totalSeconds);

                $rootScope.setCircleProgress(elapsedPercent);


                if(elapsedPercent >= 100)
                {
                    $rootScope.setBackgroundState(3);
                }
                else
                {
                    $rootScope.setBackgroundState(1);

                    if(totalSeconds-((elapsed/1000))<=60)
                    {
                        $rootScope.setBackgroundState(2);
                    }

                }


                $rootScope.timer.elapsed.minutes = ("0"+time[0]).slice(-2);

                $rootScope.timer.elapsed.seconds = ("0"+time[1]).slice(-2);

                /*
                 if(elapsedPercent >= 100)
                 {
                 $interval.cancel($scope.timer.interval);
                 }*/

            },interval);


        }
        conn.onMessage(
            function(e) {

                var data = JSON.parse(e.data);
                switch (data.type)
                {
                    case 'start':

                        if($rootScope.timer.interval)
                        {
                            $interval.cancel($rootScope.timer.interval);
                        }
                        $rootScope.timer = data.timer;

                        $rootScope.startTimer();

                        break;
                    case 'stop':

                        $rootScope.stopTimer();

                        break;
                    case 'change':

                        $rootScope.timer.set = data.set;

                        break;
                }
            }
        );

        $rootScope.stopTimer=function (remote) {


            if(remote)
            {
                $rootScope.sendMsg({type:'stop'});
            }

            if($rootScope.timer.interval)
            {

                $interval.cancel($rootScope.timer.interval);
            }
            $rootScope.setCircleProgress(0);
            $rootScope.containerStyle={};
            $rootScope.timer= { set:{},elapsed:{minutes:"00",seconds:"00"}};
        }
        $rootScope.add=function (prop,max) {

            if(!$rootScope.timer.set[prop])
            {
                $rootScope.timer.set[prop] =0 ;
            }

            if($rootScope.timer.set[prop]<max)
            {
                $rootScope.timer.set[prop]=$rootScope.timer.set[prop]+1;
            }
            else
            {
                $rootScope.timer.set[prop]=0;
            }



        }
        $rootScope.substract=function (prop,max) {

            if(!$rootScope.timer.set[prop])
            {
                $rootScope.timer.set[prop] =0 ;
            }
            if($rootScope.timer.set[prop]>0)
            {
                $rootScope.timer.set[prop]=$rootScope.timer.set[prop]-1;
            }
            else
            {
                $rootScope.timer.set[prop]=max;
            }

        }

        $rootScope.$apply();


    });







});