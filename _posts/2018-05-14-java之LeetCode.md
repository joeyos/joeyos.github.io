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

## 两数之和(哈希表)

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

## 两数相加(链表)

给定两个非空链表来表示两个非负整数。位数按照逆序方式存储，它们的每个节点只存储单个数字。将两数相加返回一个新的链表。

你可以假设除了数字 0 之外，这两个数字都不会以零开头。

**示例:**

	输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
	输出：7 -> 0 -> 8
	原因：342 + 465 = 807

```java
class ListNode {
     int val;
     ListNode next;
     ListNode(int x) { val = x; }
 }
public class Add {
	// 数组转链表
	public ListNode arrToListNode(int[] arr){
		ListNode dummyHead = new ListNode(0);
		ListNode curr = dummyHead;
		for(int i=0;i<arr.length;i++){
			curr.next = new ListNode(arr[i]);
			curr = curr.next;
			System.out.print(arr[i]);
		}
		System.out.println();
		return dummyHead.next;
	}
	// 打印链表
	public void printListNode(ListNode l){
		while(l != null){
			System.out.print(l.val);
			l=l.next;
		}
		System.out.println("");
	}
	// 两链表相加
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummyHead = new ListNode(0);
        ListNode p = l1, q = l2, curr = dummyHead;
        int carry = 0;
        while (p != null || q != null) {
            int x = (p != null) ? p.val : 0;
            int y = (q != null) ? q.val : 0;
            int sum = carry + x + y;
            carry = sum / 10;
            curr.next = new ListNode(sum % 10);
            curr = curr.next;
            if (p != null) p = p.next;
            if (q != null) q = q.next;
        }
        if (carry > 0) {
            curr.next = new ListNode(carry);
        }
        return dummyHead.next;
    }
    public static void main(String[] args){
    	int[] a1,a2;
    	a1 = new int[]{1,2,7,4};//数值4721
    	a2 = new int[]{3,6,4,8};//数值8463
    	ListNode l1,l2,l3;
    	l1 = new Add().arrToListNode(a1);
    	l2 = new Add().arrToListNode(a2);
    	l3 = new Add().addTwoNumbers(l1,l2);
    	new Add().printListNode(l3);
    	//打印链表48131(倒序)
    }
}
```