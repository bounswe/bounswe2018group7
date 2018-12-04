package com.history;

import android.content.Context;
import android.view.MotionEvent;
import android.widget.RelativeLayout;

public class MapView extends RelativeLayout{
	MapView(Context context){
		super(context);
	}
	@Override
	public boolean dispatchTouchEvent(MotionEvent ev) {
		/**
		 * Request all parents to relinquish the touch events
		 */
		getParent().requestDisallowInterceptTouchEvent(true);
		return super.dispatchTouchEvent(ev);
	}
}
