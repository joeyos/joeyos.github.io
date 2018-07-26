---
layout: post
title: "java之LeetCode"
date: 2018-05-14
categories: Java
tags: Java
author: Quan Zhang
---

* content
{:toc} 

## 两个数之和

给定一个整数数组和一个目标值，找出数组中和为目标值的两个数。

你可以假设每个输入只对应一种答案，且同样的元素不能被重复利用。

**示例:**

	给定 nums = [2, 7, 11, 15], target = 9

	因为 nums[0] + nums[1] = 2 + 7 = 9
	所以返回 [0, 1]

### 暴力法

时间复杂度：$O(n^2)$

空间复杂度：$O(1)$

```java
/*coding: GBK*/
import java.util.Arrays;
public class Add{
	public int[] twoSum(int[] nums,int target){
		for(int i=0;i<nums.length;i++){
			for(int j=i+1;j<nums.length;j++){
				if(nums[j]==target-nums[i]){
					return new int[]{i,j};
				}
			}
		}
		throw new IllegalArgumentException("No two sum solution");
	}
	public static void main(String[] args){
		//数组的表示
		int[] a = new int[]{1,2,3,4};
		int[] res = new int[2];
		res = new Add().twoSum(a,3);
		//静态方法调用非静态函数：1.new一个；2.加static
		System.out.println(Arrays.toString(res));
		//数组转字符串
	}
}
```

### 两次哈希表

时间复杂度：$O(n^2)$

空间复杂度：$O(n^2)$

```java
//两次哈希表
//寻找索引与对应数组元素的方法：哈希表
public class Add{
	public int[] twoSum(int[] nums, int target){
		Map<Integer, Integer> map = new HashMap<>();
		for(int i = 0;i<nums.length;i++){
			map.put(nums[i],i);
		}
		for(int i = 0;i<nums.length;i++){
			int complement = target - nums[i];
			if(map.containsKey(complement)&&map.get(complement)!=i){
				return new int[]{i,map.get(complement)};
			}
		}
		throw new IllegalArgumentException("No two sum solution!");
	}
	public static void main(String[] args){
		int[] a = new int[]{1,2,3,4};
		int[] res = new int[2];
		res = new Add().twoSum(a,3);
		System.out.println(Arrays.toString(res));
	}
}
```

### 一次哈希表

```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    throw new IllegalArgumentException("No two sum solution");
}
```