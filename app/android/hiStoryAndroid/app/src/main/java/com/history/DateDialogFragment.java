package com.history;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

public class DateDialogFragment extends DialogFragment {


    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        // Use the Builder class for convenient dialog construction
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());

        LayoutInflater inflater = getActivity().getLayoutInflater();

        //ViewGroup container = null;

        View v = inflater.inflate(R.layout.general_date_picker_fragment, null, false);

        Spinner spinnerDay = (Spinner) v.findViewById(R.id.general_first_spinner);
        // Create an ArrayAdapter using the string array and a default spinner layout
        ArrayAdapter<CharSequence> adapterDay = ArrayAdapter.createFromResource(getContext(),
                R.array.general_first, android.R.layout.simple_spinner_item);
        // Specify the layout to use when the list of choices appears
        adapterDay.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        // Apply the adapter to the spinner
        spinnerDay.setAdapter(adapterDay);


        Spinner spinnerMonth = (Spinner) v.findViewById(R.id.general_second_spinner);
        // Create an ArrayAdapter using the string array and a default spinner layout
        ArrayAdapter<CharSequence> adapterMonth = ArrayAdapter.createFromResource(getContext(),
                R.array.general_second, android.R.layout.simple_spinner_item);
        // Specify the layout to use when the list of choices appears
        adapterMonth.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        // Apply the adapter to the spinner
        spinnerMonth.setAdapter(adapterMonth);


        builder.setView(v)
                .setMessage("Pick a Date")
                .setPositiveButton("Set", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        // FIRE ZE MISSILES!
                    }
                })
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        // User cancelled the dialog
                    }
                }
                );
        // Create the AlertDialog object and return it
        return builder.create();
    }
}
