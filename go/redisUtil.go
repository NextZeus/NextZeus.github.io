package test

import (
	"fmt"
	"github.com/go-redis/redis"
	"testing"
)

func TestRedisCode (t *testing.T) {
	rdb := redis.NewClient(&redis.Options{
		Addr:"localhost:6379",
		Password:"",
		DB: 0,
	})

	defer rdb.Close()

	//if taskMap, error := rdb.HGetAll("hash").Result(); error == nil {
	//	fmt.Println(len(taskMap), error)
	//}
	key := "taskCount"
	pipeline := rdb.Pipeline()
	results := make([]*redis.StringStringMapCmd, 0)

	for i :=0 ; i< 2; i++ {
		results = append(results, pipeline.HGetAll(key))
	}

	cmders, err := pipeline.Exec()
	if err != nil {
		fmt.Println("err", err)
	}
	for _, cmder := range cmders {
		//cmd := cmder.(*redis.StringStringMapCmd)
		cmd := cmder.(*redis.StringStringMapCmd)
		res, err := cmd.Result()
		if err != nil {
			fmt.Println("err", err)
		}
		fmt.Println("res", res)
		for k, v := range res {
			fmt.Println("k:",k," v:",v)
		}
	}

	//taskMap_ := rdb.HGetAll("hash").Val()
	//fmt.Println(len(map[string]string{}))

	//var tasks []model.UserTaskItem
	//tasks = append(tasks, model.UserTaskItem{
	//	TaskId:         1,
	//	Sort:           0,
	//	Icon:           "",
	//	Desc:           "IN",
	//	Progress:       0,
	//	TotalProgress:  0,
	//	Times:          0,
	//	AwardType:      0,
	//	AwardGold:      0,
	//	AwardExp:       0,
	//	ExtraAwardGold: 0,
	//	Status:         false,
	//	CreateTime:     0,
	//	UpdateTime:     0,
	//})
	//tasks = append(tasks, model.UserTaskItem{
	//	TaskId:         2,
	//	Sort:           0,
	//	Icon:           "",
	//	Desc:           "CN",
	//	Progress:       0,
	//	TotalProgress:  0,
	//	Times:          0,
	//	AwardType:      0,
	//	AwardGold:      0,
	//	AwardExp:       0,
	//	ExtraAwardGold: 0,
	//	Status:         false,
	//	CreateTime:     libs.NowTimestamp(),
	//	UpdateTime:     libs.NowTimestamp(),
	//})
	//var fields  = make(map[string]interface{})
	//
	//for _, task := range tasks {
	//	if task_, err := json.Marshal(task); err == nil {
	//		fields[strconv.Itoa(int(task.TaskId))] = task_
	//	}
	//}
	//
	// if result,err :=rdb.HMSet("hash", fields).Result(); err == nil {
	//	 fmt.Println("HMSet Ok", result, err)
	// }
	//
	// duration := rdb.TTL("hash").Val()
	//_,end := libs.GetDayTimestamp()
	//
	// fmt.Println("duration: ", duration, duration.Seconds(), )
	// //if duration.Seconds() < 0 {
	//
	// 	//fmt.Println(end, time.Unix(end / 1000, 0), time.Duration(1000000))
	// 	//r,e := rdb.ExpireAt("hash", time.Unix(0, end)).Result()
	// 	 r,e:= rdb.Do("expire", "hash", (end - libs.NowTimestamp())/1000).Result()
	//
	// 	fmt.Println(r)
	// 	if e == nil {
	// 		fmt.Println(rdb.TTL("hash").Val())
	//	}
	// //}
	// if taskMap, error := rdb.HGetAll("hash").Result(); error == nil {
	//	for _, value := range taskMap {
	//		 var task model.UserTaskItem
	//		 if err_ := json.Unmarshal([]byte(value), &task); err_ == nil {
	//		 	fmt.Println(task)
	//		 } else {
	//		 	fmt.Println("error", err_)
	//		 }
	//	}
	// }
}