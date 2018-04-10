---
layout: post
title: "Verilog HDL基础知识"
date: 2016-03-07 10:22:31 
categories: FPGA
tags: FPGA
author: Quan Zhang
---

* content
{:toc}

## Verilog语言的特点和基本语法

- 较多的第三方工具的支持
- 语法结构比VHDL简单
- 学习起来比VHDL容易
- 仿真工具比较好使
- 测试激励模块容易编写

**优点：**

	在各种抽象层次上描述数字电路
	测试各种层次数字电路的行为
	设计出正确有效的复杂电路结构

## Verilog模块和电路结构的关系

### 行为级和RTL级

![](/images/blog/20160307/1.png)

RTL模块的数据流动必须基于时钟。RTL模块在每个时钟的沿时刻，其变量的值必定是精确的。

### 门结构级

![](/images/blog/20160307/2.png)

## Verilog HDL入门

	module myadder(clock, reset, a, b, sum);
	parameter width = 8;
	input clock, reset;
	input [width-1:0] a, b;
	output [width :0] sum;
	reg [width-1:0] a_reg, b_reg;
	reg [ width : 0 ] sum;
	    always @(posedge clock or negedge reset)
	        if  (!reset)  begin
	                 		 a_reg <= ’b0;  b_reg <= ’b0;   sum<= ’b0;
	                  	  end
			else   begin
	                  a_reg <= a; 
	                  b_reg <= b;
	                  sum <= a_reg + b_reg;
	               end
	endmodule

### Verilog HDL模块

![](/images/blog/20160307/3.png)

![](/images/blog/20160307/4.png)

![](/images/blog/20160307/5.png)

如在模块中逻辑功能由下面三个语句块组成：

	assign   cs  =  ( a0  &  ~a1 &  ~a2 ) ;   //  -----1
	and2   and_inst ( qout, a, b);           //  -----2
	always @ (posedge clk or posedge clr)   //-----3
	begin  if (clr) q<= 0; else if (en) q<= d;
	end

三条语句是并行的，它们产生独立的逻辑电路；而在 always 块中: begin 与 end 之间是顺序执行的。

### 模块中的信号

只有两种主要的信号类型：

- 寄存器类型：reg(被赋值的信号，往往代表触发器，不一定是触发器，只是在always块中赋值的信号)
- 连线类型：wire(assign关键词指定的逻辑组合)

### reg与wire的不同点

![](/images/blog/20160307/6.png)

![](/images/blog/20160307/7.png)

### 阻塞与非阻塞

**不阻塞赋值语句：**

	always @(posedge clk)
		begin
			b <= a;
			c <= b;
		end

![](/images/blog/20160307/8.png)

**阻塞赋值语句：**

	always @(posedge clk)
		begin
			b = a;
			c = b;
		end

![](/images/blog/20160307/9.png)
	
	非阻塞（non-blocking)  赋值语句 ( b<= a)：
	    - 块内的赋值语句同时赋值；
	    - b 的值被赋成新值 a 的操作, 是与块内其他赋值语句同时完成的；
	    - 建议在可综合风格的模块中使用不阻塞赋值。
	阻塞（blocking)  赋值语句 ( b = a)：
	    - 完成该赋值语句后才能做下一句的操作；
	    - b 的值立刻被赋成新值 a;
	    - 时序电路中硬件没有对应的电路，因而综合结果未知。

## 数字系统的构成

### 组合逻辑（无记忆）

	- 多路器
	- 加法器
	- 缓冲器
	- 逻辑开关
	- 总线
	- 逻辑运算电路

**组合逻辑的两种Verilog HDL表示：**

(1)**assign语句：**

	assign q = (a1==1?) d : 0

(2)**always块：**

	always@(al or d)
		begin
			if(al==1) q=d;
				else q=0;
		end

用always块时，没**注意**加else语句:

	always@(al or d)
		begin
			if(al==1) q=d;
		end

此时生成的不是纯组合逻辑，因为当al==0时，q能保留原来的值，所以生成的电路中有锁存器。

用always块时，必须**注意**电平敏感的信号表是否完全:

	always@(a or b or c or d)
		begin
			out = (a&b&c) | (d&e);
		end

此时生成的不是纯组合逻辑，因为当 e 变化时，out 不能立即跟着变化。只有当a 或 b 或 c 或 d 变化时e 的变化后果才显示出来。可见需要有一个寄存器来储存 e 的变化。

### 时序逻辑（有记忆）
	
	- 计数器
	- 同步有限状态机
	- 运算控制器
	- 总线分配器

**时序逻辑的Verilog HDL表示：**

(1)**always:**

	always@(posedge clock)
		if(!reset)
			do_reset;
		else case(state)
			state_1:do_state_1;
			state_2:do_state_2;
			state_3:do_state_3;
			state_4:do_state_4;
			state_5:do_state_5;
			default:state <= xx;
		endcase
	task dp_reset;
		begin
			Reset_Every_Register;
			Prepare_For_Next_State;
		end
	endtask
	task do_state_1;
	   begin  if (Condition_Is_True)
	         Switch_Proper_Control_Logic;
	         Prepare_For_Next_State;
	      else Stay_In_Original_State;
	   end
	endtask
	task do_state_2;
	   begin if (Condition_Is_True)
	        Switch_Proper_Control_Logic;
	        Prepare_For_Next_State;
	        else Stay_In_Original_State;
	   end
	endtask



